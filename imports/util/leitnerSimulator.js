import {Mongo} from "meteor/mongo";
import {Utilities} from "./utilities";
import {Session} from "meteor/session";
import {Cards} from "../api/subscriptions/cards.js";
import {Cardsets} from "../api/subscriptions/cardsets";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerUtilities} from "./leitner";
import {SweetAlertMessages} from "./sweetAlert";
import {BonusForm} from "./bonusForm";
import {CardType} from "./cardTypes";
import {AnswerUtilities} from "./answers";
import {LeitnerProgress} from "./leitnerProgress";
import {ReactiveVar} from 'meteor/reactive-var';

let leitnerCardCount;
let leitnerSimulatorDays;
let activeSimulatorDay = moment();
let snapshotDays;
let snapshots;
let leitnerErrorCount;
let tempMaxWorkload;
let leitnerHistory = new Mongo.Collection(null);
let leitnerTask = new Mongo.Collection(null);
let leitnerCards = new Mongo.Collection(null);
let workload = new Mongo.Collection(null);
let isCalculating = new ReactiveVar(true);
let currentDay = new ReactiveVar(1);

export let LeitnerSimulator = class LeitnerSimulator {
	static leitnerHistory () {
		return leitnerHistory;
	}

	static leitnerTask () {
		return leitnerTask;
	}

	static leitnerCards () {
		return leitnerCards;
	}

	static workload () {
		return workload;
	}

	static getTempMaxWorkload () {
		return tempMaxWorkload;
	}

	static isCalculating () {
		return isCalculating.get();
	}

	static getCurrentDay () {
		return currentDay.get();
	}

	static updateSimulator (runSimulation = true) {
		isCalculating.set(true);

		setTimeout(() => {
			this.initializeSimulatorData(runSimulation);
			LeitnerProgress.updateGraph();
		}, 3000);
	}

	static initializeSimulatorData (runSimulation = true) {
		if (Meteor.isClient) {
			leitnerHistory = new Mongo.Collection(null);
			leitnerTask = new Mongo.Collection(null);
			leitnerCards = new Mongo.Collection(null);
			workload = new Mongo.Collection(null);
			let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')});
			LeitnerUtilities.initialzeWorkload(cardset._id, Meteor.userId());
			LeitnerUtilities.addLeitnerCards(cardset, Meteor.userId());
			activeSimulatorDay = moment().add(1, 'hour');
			snapshots = [];
			tempMaxWorkload = BonusForm.getMaxWorkload(true);
			leitnerCardCount = leitnerCards.find().count();
			if (runSimulation) {
				this.runSimulation();
			}
		}
	}

	static resetSimulatorData () {
		leitnerSimulatorDays = 0;
		leitnerCardCount = 0;
		leitnerErrorCount = Array.from(Array(5).fill(0));
		BonusForm.adjustErrorCount();
		snapshots = [];
		snapshotDays = [];
	}

	static getActiveSimulatorDay () {
		return activeSimulatorDay;
	}

	static createSnapshotDates () {
		this.resetSimulatorData();
		let bonusStart = moment(BonusForm.getDateStart());
		let bonusEnd = moment(BonusForm.getDateEnd());
		leitnerSimulatorDays = bonusEnd.diff(bonusStart, 'days');
		// Add starting and end date to the difference
		leitnerSimulatorDays += 2;
		let steps = Math.round(leitnerSimulatorDays / 6);
		let snapshotDates = [];
		for (let i = 1; i < 6; i++) {
			let newDate = moment(bonusStart).add(steps * i,'days');
			snapshotDays.push(steps * i);
			snapshotDates.push(Utilities.getMomentsDateShort(newDate));
		}
		snapshotDates.push(Utilities.getMomentsDateShort(bonusEnd));
		Session.set('simulatorSnapshotDates', snapshotDates);
	}

	static initializeSimulatorWorkload () {
		for (let i = 1; i <= 5; i++) {
			$('#bonusFormSimulatorInterval' + i).val(parseInt($('#bonusFormInterval' + i).val()));
		}
		$('#maxWorkloadSimulator').val(parseInt($('#maxWorkload').val()));
	}

	static runSimulation () {
		let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')});

		LeitnerUtilities.setCards(cardset, Meteor.user(), false, true);

		LeitnerProgress.setupTempData(FlowRouter.getParam('_id'), '', 'simulator');
		let cardsetFilter = LeitnerProgress.getCardsetCardCount(false);

		for (let d = 0; d < leitnerSimulatorDays; d++) {
			currentDay.set(d + 1);
			let leitnerCards = this.leitnerCards().find({active: true}).fetch();
			for (let c = 0 ; c < leitnerCards.length; c++) {
				let cardCardset = Cardsets.findOne({_id: leitnerCards[c].cardset_id}, {fields: {cardType: 1}});
				let card = Cards.findOne({_id: leitnerCards[c].card_id});
				let timestamps = {
					question: moment().subtract(1, 'minute'),
					answer: moment()
				};
				if (CardType.gotAnswerOptions(cardCardset.cardType) && card.answers.enabled) {
					AnswerUtilities.setMCAnswers(["1", "2", "3"], leitnerCards[c].card_id, cardCardset._id, card.answers.rightAnswers, timestamps);
					timestamps.submission = moment().add(1, 'minute');
					AnswerUtilities.nextMCCard(card._id, cardCardset._id, timestamps);
				} else {
					timestamps.submission = moment().add(1, 'minute');
					AnswerUtilities.updateSimpleAnswer(cardCardset._id, card._id, 0, timestamps);
				}
			}
			activeSimulatorDay.add(1, 'day');
			LeitnerUtilities.setCards(cardset, Meteor.user(), false, false);
			let shortDate = Utilities.getMomentsDateShort(activeSimulatorDay);
			if (Session.get('simulatorSnapshotDates').includes(shortDate)) {
				LeitnerProgress.setupTempData(FlowRouter.getParam('_id'), '', 'simulator');
				let snapshotSubgroup = [];
				snapshotSubgroup.push(LeitnerProgress.getGraphData());
				for (let i = 0; i < cardsetFilter.length; i++) {
					snapshotSubgroup.push(LeitnerProgress.getGraphData(cardsetFilter[i]._id));
				}
				snapshots.push(snapshotSubgroup);
			}
		}
		isCalculating.set(false);
		console.log(isCalculating.get());
		return leitnerCards.find({box: 6}).count();
	}

	static getSnapshots () {
		return snapshots;
	}

	static calculateWorkload (maxWorkload, interval = 0, isReverse = false, finetuning = false) {
		if (maxWorkload > 100) {
			SweetAlertMessages.leitnerSimulatorError();
			return;
		}
		let result = this.runSimulation(maxWorkload);
		if (interval === 0 && result === leitnerCardCount) {
			isReverse = true;
		}
		let steps = 5;

		if (isReverse) {
			if (result !== leitnerCardCount) {
				for (let fineTuneSteps = 1; fineTuneSteps < steps + 1; fineTuneSteps++) {
					result = this.runSimulation(maxWorkload + fineTuneSteps);
					if (result === leitnerCardCount) {
						BonusForm.setMaxWorkload(maxWorkload + fineTuneSteps, true);
						this.runSimulation(maxWorkload + fineTuneSteps);
						break;
					}
				}
			} else {
				this.calculateWorkload(maxWorkload - steps, interval + 1, isReverse, finetuning);
			}
		} else {
			if (result !== leitnerCardCount) {
				this.calculateWorkload(maxWorkload + steps, interval + 1, isReverse, finetuning);
			} else {
				for (let fineTuneSteps = 1; fineTuneSteps < steps + 1; fineTuneSteps++) {
					result = this.runSimulation(maxWorkload - fineTuneSteps);
					if (result !== leitnerCardCount) {
						fineTuneSteps--;
						BonusForm.setMaxWorkload(maxWorkload - fineTuneSteps, true);
						this.runSimulation(maxWorkload - fineTuneSteps);
						break;
					}
				}
			}
		}
	}

	static getCardCount () {
		return leitnerCardCount;
	}

	static getErrorCount () {
		return leitnerErrorCount;
	}

	static getSnapshotDates () {
		return Session.get('simulatorSnapshotDates');
	}

	static getActiveSnapshot () {
		return snapshots[Session.get('activeSimulatorSnapshotDate')][Session.get('activeSimulatorSnapshotDateSubgroup')];
	}
};
