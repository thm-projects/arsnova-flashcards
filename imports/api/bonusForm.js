import {Session} from "meteor/session";
import {Cardsets} from "./cardsets";
import {PomodoroTimer} from "./pomodoroTimer";
import * as config from "../config/bonusForm.js";
import {Utilities} from "./utilities";
import {CardType} from "./cardTypes";

let leitnerSimulator = new Uint16Array(6);
let leitnerSimulatorBox1;
let leitnerSimulatorBox2;
let leitnerSimulatorBox3;
let leitnerSimulatorBox4;
let leitnerSimulatorBox5;

export let BonusForm = class BonusForm {
	static cleanModal () {
		let start, nextDay, end, intervals, maxWorkload, daysBeforeReset, registrationPeriod;
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
		} else {
			start = moment(Session.get('activeCardset').learningStart).format(config.dateFormat);
			nextDay = moment(Session.get('activeCardset').learningStart).add(1, 'day').format(config.dateFormat);
			end = moment(Session.get('activeCardset').learningEnd).format(config.dateFormat);
			registrationPeriod = moment(Session.get('activeCardset').registrationPeriod).format(config.dateFormat);
			maxWorkload = Session.get('activeCardset').maxCards;
			daysBeforeReset = Session.get('activeCardset').daysBeforeReset;
			intervals = Session.get('activeCardset').learningInterval;
			dateBonusStart.attr("min", start);
		}
		$('#maxWorkload').val(maxWorkload);
		$('#bonusFormModal #daysBeforeReset').val(daysBeforeReset);
		$('#bonusFormModal #interval1').val(intervals[0]);
		$('#bonusFormModal #interval2').val(intervals[1]);
		$('#bonusFormModal #interval3').val(intervals[2]);
		$('#bonusFormModal #interval4').val(intervals[3]);
		$('#bonusFormModal #interval5').val(intervals[4]);
		dateBonusStart.attr("min", start);
		dateBonusStart.val(start);
		dateBonusEnd.attr("min", nextDay);
		dateBonusEnd.val(end);
		dateRegistrationPeriodExpires.attr("min", nextDay);
		dateRegistrationPeriodExpires.attr("max", end);
		dateRegistrationPeriodExpires.val(registrationPeriod);
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

	static adjustInterval () {
		let interval, nextInterval;
		for (let i = 1; i < 5; ++i) {
			interval = $('#bonusFormModal #interval' + i);
			nextInterval = $('#bonusFormModal #interval' + (i + 1));
			if (parseInt(interval.val()) >= parseInt(nextInterval.val())) {
				nextInterval.val(parseInt(interval.val()) + 1);
			}
		}
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

	static createSnapshotDates () {
		let bonusStart = moment(this.getDateStart());
		let bonusEnd = moment(this.getDateEnd());
		let numberOfDays = bonusEnd.diff(bonusStart, 'days');
		let steps = Math.round(numberOfDays / 6);
		let snapshotDates = [];
		for (let i = 1; i < 6; i++) {
			let newDate = moment(bonusStart).add(steps * i,'days');
			snapshotDates.push(Utilities.getMomentsDateShort(newDate));
		}
		snapshotDates.push(Utilities.getMomentsDateShort(bonusEnd));
		Session.set('simulatorSnapshotDates', snapshotDates);
		this.initializeSimulatorData();
	}

	static initializeSimulatorData () {
		let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {cardGroups: 1, shuffled: 1, quantity: 1}});
		if (cardset !== undefined) {
			let cardCount = 0;
			if (cardset.shuffled) {
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					let cardGroup = Cardsets.findOne({_id: cardset.cardGroups[i]}, {fields: {cardType: 1, quantity: 1}});
					if (CardType.gotLearningModes(cardGroup.cardType)) {
						cardCount += cardGroup.quantity;
					}
				}
			} else {
				cardCount = cardset.quantity;
			}
			leitnerSimulator = new Uint16Array(6);
			leitnerSimulator[0] = cardCount;
		}
		let intervals = this.getIntervals();
		leitnerSimulatorBox1 = new Uint16Array(intervals[0]);
		leitnerSimulatorBox2 = new Uint16Array(intervals[1]);
		leitnerSimulatorBox3 = new Uint16Array(intervals[2]);
		leitnerSimulatorBox4 = new Uint16Array(intervals[3]);
		leitnerSimulatorBox5 = new Uint16Array(intervals[4]);
	}

	static getSnapshotDates () {
		return Session.get('simulatorSnapshotDates');
	}

	static getActiveSnapshot () {
		return Array.from(leitnerSimulator);
	}

	static getDateEnd () {
		let dateEnd = new Date($('#bonusFormModal #dateBonusEnd').val());
		if (!dateEnd) {
			dateEnd = config.defaultDateEnd;
		}
		return dateEnd;
	}

	static getIntervals () {
		let intervals = [];
		for (let i = 0; i < 5; ++i) {
			intervals[i] = Number($('#bonusFormModal #interval' + (i + 1)).val());
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
			maxBonusPoints = Number(config.defaultMaxWorkload);
		}
		return maxBonusPoints;
	}

	static startBonus () {
		Meteor.call("activateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod(), this.getMaxBonusPoints(), PomodoroTimer.getGoalPoms(), PomodoroTimer.getPomLength(), PomodoroTimer.getBreakLength(), PomodoroTimer.getSoundConfig(), function (error, result) {
			if (result) {
				Session.set('activeCardset', Cardsets.findOne(result));
			}
		});
	}

	static updateBonus () {
		Meteor.call("updateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod(), this.getMaxBonusPoints(), PomodoroTimer.getGoalPoms(), PomodoroTimer.getPomLength(), PomodoroTimer.getBreakLength(), PomodoroTimer.getSoundConfig(), function (error, result) {
			if (result) {
				Session.set('activeCardset', Cardsets.findOne(result));
			}
		});
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
