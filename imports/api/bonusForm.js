import {Session} from "meteor/session";
import {Cardsets} from "./cardsets";

let minWorkloadCap = 1;
let defaultMaxWorkload = 30;

let minDaysBeforeReset = 3;
let maxDaysBeforeReset = 31;
let defaultDaysBeforeReset = 7;

let dateFormat = "YYYY-MM-DD";
let defaultRegistrationPeriod = [31, 'days'];
let defaultDateRegistrationPeriod = moment().add(defaultRegistrationPeriod[0], defaultRegistrationPeriod[1]).format(dateFormat);
let defaultIntervals = [1, 3, 7, 28, 84];
let defaultDateStart = moment().format(dateFormat);
let defaultEndPeriod = [3, 'months'];
let defaultDateEnd = moment().add(defaultEndPeriod[0], defaultEndPeriod[1]).format(dateFormat);

export let BonusForm = class BonusForm {
	static cleanModal () {
		let start, nextDay, end, intervals, maxWorkload, daysBeforeReset, registrationPeriod;
		let dateBonusStart = $('#bonusFormModal #dateBonusStart');
		let dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		let dateRegistrationPeriodExpires = $('#bonusFormModal #dateRegistrationPeriod');
		if (Session.get('isNewBonus')) {
			start = defaultDateStart;
			dateBonusStart.attr("min", defaultDateStart);
			nextDay = moment().add(1, 'day').format(dateFormat);
			end = defaultDateEnd;
			registrationPeriod = defaultDateRegistrationPeriod;
			maxWorkload = null;
			daysBeforeReset = null;
			intervals = defaultIntervals;
		} else {
			start = moment(Session.get('activeCardset').learningStart).format(dateFormat);
			nextDay = moment(Session.get('activeCardset').learningStart).add(1, 'day').format(dateFormat);
			end = moment(Session.get('activeCardset').learningEnd).format(dateFormat);
			registrationPeriod = moment(Session.get('activeCardset').registrationPeriod).format(dateFormat);
			maxWorkload = Session.get('activeCardset').maxCards;
			daysBeforeReset = Session.get('activeCardset').daysBeforeReset;
			intervals = Session.get('activeCardset').learningInterval;
			dateBonusStart.attr("min", start);
		}
		$('#bonusFormModal #maxWorkload').val(maxWorkload);
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
		let dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		let dateRegistrationPeriodExpires = $('#bonusFormModal #dateRegistrationPeriod');
		dateRegistrationPeriodExpires.attr("max", dateBonusEnd.val());
		if (this.getDateEnd().getTime() < this.getRegistrationPeriod().getTime()) {
			dateRegistrationPeriodExpires.val(moment(dateBonusEnd.val()).format(dateFormat));
		}
	}

	static adjustDaysBeforeReset () {
		if (parseInt($('#bonusFormModal #daysBeforeReset').val()) <= (minDaysBeforeReset - 1)) {
			$('#bonusFormModal #daysBeforeReset').val(minDaysBeforeReset);
		} else if (parseInt($('#bonusFormModal #daysBeforeReset').val()) > maxDaysBeforeReset) {
			$('#bonusFormModal #daysBeforeReset').val(maxDaysBeforeReset);
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

	static adjustMaxWorkload () {
		if (parseInt($('#bonusFormModal #maxWorkload').val()) <= (minWorkloadCap - 1)) {
			$('#bonusFormModal #maxWorkload').val(minWorkloadCap);
		} else if (parseInt($('#bonusFormModal #maxWorkload').val()) > Session.get('activeCardset').quantity) {
			$('#bonusFormModal #maxWorkload').val(Session.get('activeCardset').quantity);
		}
	}

	static getMaxWorkload () {
		let maxWorkload = Number($('#bonusFormModal #maxWorkload').val());
		if (!maxWorkload) {
			maxWorkload = Number(defaultMaxWorkload);
		}
		return maxWorkload;
	}

	static getDaysBeforeReset () {
		let daysBeforeReset = Number($('#bonusFormModal #daysBeforeReset').val());
		if (!daysBeforeReset) {
			daysBeforeReset = Number(defaultDaysBeforeReset);
		}
		return daysBeforeReset;
	}

	static getDateStart () {
		let dateStart = new Date($('#bonusFormModal #dateBonusStart').val());
		if (!dateStart) {
			dateStart = defaultDateStart;
		}
		return dateStart;
	}

	static getDateEnd () {
		let dateEnd = new Date($('#bonusFormModal #dateBonusEnd').val());
		if (!dateEnd) {
			dateEnd = defaultDateEnd;
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
				intervals[i] = Number(defaultIntervals[i]);
			}
		}
		return intervals;
	}

	static getRegistrationPeriod () {
		let registrationPeriod = new Date($('#bonusFormModal #dateRegistrationPeriod').val());
		if (!registrationPeriod) {
			registrationPeriod = defaultDateRegistrationPeriod;
		}
		return registrationPeriod;
	}

	static startBonus () {
		Meteor.call("activateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod());
	}

	static updateBonus () {
		Meteor.call("updateBonus", Session.get('activeCardset')._id, this.getMaxWorkload(), this.getDaysBeforeReset(), this.getDateStart(), this.getDateEnd(), this.getIntervals(), this.getRegistrationPeriod(), function (error, result) {
			if (result) {
				Session.set('activeCardset', Cardsets.findOne(result));
			}
		});
	}
};
