import {Session} from "meteor/session";
import {Cardsets} from "../api/subscriptions/cardsets";
import {PomodoroTimer} from "./pomodoroTimer";
import * as config from "../config/bonusForm.js";
import * as leitnerConfig from "../config/leitner.js";
import {Utilities} from "./utilities";
import {CardType} from "./cardTypes";
import {LeitnerUtilities} from "./leitner";
import {SweetAlertMessages} from "./sweetAlert";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let leitnerSimulator;
let leitnerSimulatorDays;
let leitnerCardCount;
let snapshots;
let snapshotDays;
let leitnerErrorCount;

export let BonusForm = class BonusForm {
	static cleanModal () {
		let start, nextDay, end, intervals, maxWorkload, daysBeforeReset, registrationPeriod, errorCount;
		let dateBonusStart = $('#bonusFormModal #dateBonusStart');
		let dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		let dateRegistrationPeriodExpires = $('#bonusFormModal #dateRegistrationPeriod');
		if (Session.get('isNewBonus')) {
			start = config.defaultDateStart;
			dateBonusStart.attr("min", config.defaultDateStart);
			nextDay = moment().add(1, 'day').format(config.dateFormat);
			end = config.defaultDateEnd;
			registrationPeriod = config.defaultDateRegistrationPeriod;
			maxWorkload = null;
			daysBeforeReset = null;
			intervals = config.defaultIntervals;
			errorCount = config.defaultErrorCount;
		} else {
			start = moment(Session.get('activeCardset').learningStart).format(config.dateFormat);
			nextDay = moment(Session.get('activeCardset').learningStart).add(1, 'day').format(config.dateFormat);
			end = moment(Session.get('activeCardset').learningEnd).format(config.dateFormat);
			registrationPeriod = moment(Session.get('activeCardset').registrationPeriod).format(config.dateFormat);
			maxWorkload = Session.get('activeCardset').maxCards;
			daysBeforeReset = Session.get('activeCardset').daysBeforeReset;
			intervals = Session.get('activeCardset').learningInterval;
			dateBonusStart.attr("min", start);
			if (Session.get('activeCardset').workload !== undefined && Session.get('activeCardset').workload.simulator !== undefined) {
				errorCount = Session.get('activeCardset').workload.simulator.errorCount[0];
			} else {
				errorCount = config.defaultErrorCount;
			}
		}
		$('#maxWorkload').val(maxWorkload);
		$('#bonusFormModal #daysBeforeReset').val(daysBeforeReset);
		for (let i = 0; i < 5; i++) {
			$('#bonusFormInterval' + (i + 1)).val(intervals[i]);
			let errorRate = $('#errorRate' + (i + 1));
			errorRate.val(errorCount[i]);
			errorRate.attr("placeholder", errorCount[i]);
		}
		dateBonusStart.attr("min", start);
		dateBonusStart.val(start);
		dateBonusEnd.attr("min", nextDay);
		dateBonusEnd.val(end);
		dateRegistrationPeriodExpires.attr("min", nextDay);
		dateRegistrationPeriodExpires.attr("max", end);
		dateRegistrationPeriodExpires.val(registrationPeriod);
		$('#strictWorkloadTimer').prop('checked', Session.get('activeCardset').strictWorkloadTimer);
	}

	static adjustRegistrationPeriod () {
		let dateBonusStart = $('#bonusFormModal #dateBonusStart');
		let dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		let dateRegistrationPeriodExpires = $('#bonusFormModal #dateRegistrationPeriod');
		dateRegistrationPeriodExpires.attr("min", moment(dateBonusStart.val()).add(1, 'day').format(config.dateFormat));
		dateRegistrationPeriodExpires.attr("max", dateBonusEnd.val());
		if (this.getDateStart().getTime() >= this.getRegistrationPeriod().getTime()) {
			dateRegistrationPeriodExpires.val(moment(dateBonusStart.val()).add(1, 'day').format(config.dateFormat));
		}
		if (this.getDateEnd().getTime() < this.getRegistrationPeriod().getTime()) {
			dateRegistrationPeriodExpires.val(moment(dateBonusEnd.val()).format(config.dateFormat));
		}
	}

	static adjustDaysBeforeReset () {
		if (parseInt($('#bonusFormModal #daysBeforeReset').val()) <= (config.minDaysBeforeReset - 1)) {
			$('#bonusFormModal #daysBeforeReset').val(config.minDaysBeforeReset);
		} else if (parseInt($('#bonusFormModal #daysBeforeReset').val()) > config.maxDaysBeforeReset) {
			$('#bonusFormModal #daysBeforeReset').val(config.maxDaysBeforeReset);
		}
	}

	static getCardCount () {
		return leitnerCardCount;
	}

	static adjustInterval (isSimulator = false) {
		let interval, nextInterval;
		for (let i = 1; i < 5; ++i) {
			if (isSimulator) {
				interval = $('#bonusFormSimulatorInterval' + i);
				nextInterval = $('#bonusFormSimulatorInterval' + (i + 1));
			} else {
				interval = $('#bonusFormInterval' + i);
				nextInterval = $('#bonusFormInterval' + (i + 1));
			}
			if (parseInt(interval.val()) >= parseInt(nextInterval.val())) {
				nextInterval.val(parseInt(interval.val()) + 1);
			}
		}
	}

	static getErrorCount () {
		return leitnerErrorCount;
	}

	static resetErrorCount () {
		for (let i = 0; i < 5; i++) {
			Number($('#errorRate' + (i + 1)).val(config.defaultErrorCount[i]));
		}
	}

	static addSimulatorChanges () {
		for (let i = 1; i <= 5; i++) {
			$('#bonusFormInterval' + i).val(parseInt($('#bonusFormSimulatorInterval' + i).val()));
		}
		let maxWorkload =  parseInt($('#maxWorkloadSimulator').val());
		$('#maxWorkload').val(maxWorkload);
		$('#pomNumSlider').val(Math.ceil(Number(maxWorkload) / 10));
	}

	static adjustErrorCount () {
		for (let i = 0; i < 5; i++) {
			let percentage = Number($('#errorRate' + (i + 1)).val());
			leitnerErrorCount[i] = Math.round((this.getCardCount() / 100) * percentage);
		}
	}

	static getErrorCountPercentage () {
		let percentage = [];
		for (let i = 0; i < 5; i++) {
			percentage.push(Number($('#errorRate' + (i + 1)).val()));
		}
		return percentage;
	}

	static adjustMaxBonusPoints () {
		if (parseInt($('#bonusFormModal #maxBonusPoints').val()) <= (config.defaultMinBonusPoints - 1)) {
			$('#bonusFormModal #maxBonusPoints').val(config.defaultMinBonusPoints);
		} else if (parseInt($('#bonusFormModal #maxBonusPoints').val()) > config.defaultMaxBonusPoints) {
			$('#bonusFormModal #maxBonusPoints').val(config.defaultMaxBonusPoints);
		}
	}

	static adjustMaxWorkload () {
		if (parseInt($('#maxWorkload').val()) <= (config.minWorkloadCap - 1)) {
			$('#maxWorkload').val(config.minWorkloadCap);
		} else if (parseInt($('#maxWorkload').val()) > Session.get('activeCardset').quantity) {
			$('#maxWorkload').val(Session.get('activeCardset').quantity);
		}
	}

	static getMaxWorkload () {
		let maxWorkload = Number($('#maxWorkload').val());
		if (!maxWorkload) {
			maxWorkload = Number(config.defaultMaxWorkload);
		}
		return maxWorkload;
	}

	static setMaxWorkload (maxWorkload, isSimulator = false) {
		if (isSimulator) {
			$('#maxWorkloadSimulator').val(Number(maxWorkload));
		} else {
			$('#maxWorkload').val(Number(maxWorkload));
		}
		PomodoroTimer.updatePomNumSlider();
	}

	static getDaysBeforeReset () {
		let daysBeforeReset = Number($('#bonusFormModal #daysBeforeReset').val());
		if (!daysBeforeReset) {
			daysBeforeReset = Number(config.defaultDaysBeforeReset);
		}
		return daysBeforeReset;
	}

	static getDateStart () {
		let dateStart = new Date($('#bonusFormModal #dateBonusStart').val());
		if (!dateStart) {
			dateStart = config.defaultDateStart;
		}
		return dateStart;
	}

	static resetSimulatorData () {
		leitnerSimulator = Array.from(Array(6).fill(0));
		leitnerSimulatorDays = 0;
		leitnerCardCount = 0;
		leitnerErrorCount = Array.from(Array(5).fill(0));
		this.adjustErrorCount();
		snapshots = [];
		snapshotDays = [];
	}

	static createSnapshotDates () {
		this.resetSimulatorData();
		let bonusStart = moment(this.getDateStart());
		let bonusEnd = moment(this.getDateEnd());
		leitnerSimulatorDays = bonusEnd.diff(bonusStart, 'days');
		let steps = Math.round(leitnerSimulatorDays / 6);
		let snapshotDates = [];
		for (let i = 1; i < 6; i++) {
			let newDate = moment(bonusStart).add(steps * i,'days');
			snapshotDays.push(steps * i);
			snapshotDates.push(Utilities.getMomentsDateShort(newDate));
		}
		snapshotDates.push(Utilities.getMomentsDateShort(bonusEnd));
		Session.set('simulatorSnapshotDates', snapshotDates);
		this.initializeSimulatorData();
	}

	static initializeSimulatorWorkload () {
		for (let i = 1; i <= 5; i++) {
			$('#bonusFormSimulatorInterval' + i).val(parseInt($('#bonusFormInterval' + i).val()));
		}
		$('#maxWorkloadSimulator').val(parseInt($('#maxWorkload').val()));
	}

	static initializeSimulatorData () {
		this.adjustErrorCount();
		let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {cardGroups: 1, shuffled: 1, quantity: 1}});
		if (cardset !== undefined) {
			if (cardset.shuffled) {
				leitnerCardCount = 0;
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					let cardGroup = Cardsets.findOne({_id: cardset.cardGroups[i]}, {fields: {cardType: 1, quantity: 1}});
					if (CardType.gotLearningModes(cardGroup.cardType)) {
						leitnerCardCount += cardGroup.quantity;
					}
				}
			} else {
				leitnerCardCount = cardset.quantity;
			}
		}
		this.runSimulation(this.getMaxWorkload());
	}

	static runSimulation (maxCards) {
		leitnerSimulator = new Array(6).fill(0);
		leitnerSimulator[0] = leitnerCardCount;
		let intervals = this.getIntervals(true);
		let errorCount = this.getErrorCount().slice();
		snapshots = [];
		let simulatorTimeout  = [];
		for (let i = 0; i < intervals.length; i++) {
			let leitnerSimulatorBox = Array.from(Array(intervals[i]).fill(0));
			simulatorTimeout.push(leitnerSimulatorBox);
		}
		let simulatedCardset = {
			maxCards: maxCards
		};
		for (let d = 0; d < leitnerSimulatorDays; d++) {
			for (let i = 0; i < simulatorTimeout.length; i++) {
				let tempCards = simulatorTimeout[i].shift();
				if (tempCards) {
					leitnerSimulator[i] += tempCards;
					if (i === 0) {
						simulatorTimeout[0].push(0);
					}
				}
			}
			let algorithm = LeitnerUtilities.getBoxAlgorithm();
			let activeBoxes = leitnerSimulator.slice(0, 5);
			let adjustedAlgorithm = LeitnerUtilities.adjustBoxAlgorithm(activeBoxes, algorithm);
			let boxActiveCardCap = LeitnerUtilities.setActiveCardCap(simulatedCardset, adjustedAlgorithm);
			if (leitnerConfig.fillUpMissingCards) {
				boxActiveCardCap = LeitnerUtilities.fillUpMissingCards(boxActiveCardCap, activeBoxes);
			}
			for (let i = 0; i < boxActiveCardCap.length; i++) {
				let tempCards;
				if (leitnerSimulator[i] < boxActiveCardCap[i]) {
					tempCards = leitnerSimulator[i];
					leitnerSimulator[i] = 0;
				} else {
					tempCards = boxActiveCardCap[i];
					leitnerSimulator[i] -= boxActiveCardCap[i];
				}
				if (i === (boxActiveCardCap.length - 1)) {
					leitnerSimulator[leitnerSimulator.length - 1] += tempCards;
				} else {
					if (errorCount[i] > 0) {
						let resetTempCards;
						if (errorCount[i] < tempCards) {
							resetTempCards = errorCount[i];
							tempCards -= errorCount[i];
							errorCount[i] = 0;
							simulatorTimeout[i + 1].push(tempCards);
						} else {
							resetTempCards = tempCards;
							errorCount[i] -= tempCards;
						}
						if (i > 0) {
							simulatorTimeout[i - 1].push(resetTempCards);
						} else {
							simulatorTimeout[0].push(resetTempCards);
						}
					} else {
						simulatorTimeout[i + 1].push(tempCards);
					}
				}
			}
			if (snapshotDays.includes(d)) {
				let simulatorTimeoutCopy = simulatorTimeout.slice();
				let leitnerSimulatorCopy = leitnerSimulator.slice();
				for (let i = 0; i < simulatorTimeoutCopy.length; i++) {
					leitnerSimulatorCopy[i] += simulatorTimeoutCopy[i].reduce((a, b) => a + b, 0);
				}
				snapshots.push(leitnerSimulatorCopy);
			}
		}
		for (let i = 0; i < simulatorTimeout.length; i++) {
			leitnerSimulator[i] += simulatorTimeout[i].reduce((a, b) => a + b, 0);
		}
		snapshots.push(leitnerSimulator);
		return leitnerSimulator[leitnerSimulator.length - 1];
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
						this.setMaxWorkload(maxWorkload + fineTuneSteps, true);
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
						this.setMaxWorkload(maxWorkload - fineTuneSteps, true);
						this.runSimulation(maxWorkload - fineTuneSteps);
						break;
					}
				}
			}
		}
	}

	static getSnapshotDates () {
		return Session.get('simulatorSnapshotDates');
	}

	static getActiveSnapshot () {
		return snapshots[Session.get('activeSimulatorSnapshotDate')];
	}

	static getDateEnd () {
		let dateEnd = new Date($('#bonusFormModal #dateBonusEnd').val());
		if (!dateEnd) {
			dateEnd = config.defaultDateEnd;
		}
		return dateEnd;
	}

	static getIntervals (isSimulator = false) {
		let intervals = [];
		for (let i = 0; i < 5; ++i) {
			if (isSimulator) {
				intervals[i] = Number($('#bonusFormSimulatorInterval' + (i + 1)).val());
			} else {
				intervals[i] = Number($('#bonusFormInterval' + (i + 1)).val());
			}
		}
		if (!intervals[0]) {
			intervals[0] = 1;
		}
		for (let i = 0; i < 5; ++i) {
			if (!intervals[i]) {
				intervals[i] = Number(config.defaultIntervals[i]);
			}
		}
		return intervals;
	}

	static getRegistrationPeriod () {
		let registrationPeriod = new Date($('#bonusFormModal #dateRegistrationPeriod').val());
		if (!registrationPeriod) {
			registrationPeriod = config.defaultDateRegistrationPeriod;
		}
		return registrationPeriod;
	}

	static getMaxBonusPoints () {
		let maxBonusPoints = Number($('#bonusFormModal #maxBonusPoints').val());
		if (!maxBonusPoints) {
			maxBonusPoints = Number(config.defaultMaxBonusPoints);
		}
		return maxBonusPoints;
	}

	static getMinLearned () {
		let maxBonusPoints = Number($('#bonusFormModal #minLearned').val());
		if (!maxBonusPoints) {
			maxBonusPoints = Number(config.defaultMinLearned);
		}
		return maxBonusPoints;
	}

	static getStrictWorkloadTimer () {
		return document.getElementById("strictWorkloadTimer").checked;
	}

	static startBonus () {
		Meteor.call("activateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod(), this.getMaxBonusPoints(), PomodoroTimer.getGoalPoms(), PomodoroTimer.getPomLength(), PomodoroTimer.getBreakLength(), PomodoroTimer.getSoundConfig(), [this.getErrorCountPercentage()], this.getMinLearned(), this.getStrictWorkloadTimer(), function (error, result) {
			if (result) {
				Session.set('activeCardset', Cardsets.findOne(result));
			}
		});
	}

	static updateBonus () {
		Meteor.call("updateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod(), this.getMaxBonusPoints(), PomodoroTimer.getGoalPoms(), PomodoroTimer.getPomLength(), PomodoroTimer.getBreakLength(), PomodoroTimer.getSoundConfig(), [this.getErrorCountPercentage()], this.getMinLearned(), this.getStrictWorkloadTimer(), function (error, result) {
			if (result) {
				Session.set('activeCardset', Cardsets.findOne(result));
			}
		});
	}

	static getDefaultMinLearned () {
		return config.defaultMinLearned;
	}

	static getCurrentMinLearned (cardset) {
		if (cardset.workload === undefined) {
			return config.defaultMinLearned;
		} else {
			return cardset.workload.bonus.minLearned;
		}
	}

	static getDefaultMaxBonusPoints () {
		return config.defaultMaxBonusPoints;
	}

	static getDefaultMinBonusPoints () {
		return config.defaultMinBonusPoints;
	}

	static getCurrentMaxBonusPoints (cardset) {
		if (cardset.workload === undefined || cardset.workload.bonus === undefined) {
			return this.getDefaultMaxBonusPoints();
		} else {
			return cardset.workload.bonus.maxPoints;
		}
	}
};
