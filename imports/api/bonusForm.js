import {Session} from "meteor/session";

let defaultMaxWorkload = null;
let defaultDaysBeforeReset = null;
let defaultIntervals = [1, 3, 7, 28, 84];

export let BonusForm = class BonusForm {
	static cleanModal () {
		let start, nextDay, end, dateBonusStart, dateBonusEnd, intervals, maxWorkload, daysBeforeReset;
		if (Session.get('isNewBonus')) {
			start = moment().format("YYYY-MM-DD");
			nextDay = moment().add(1, 'day').format("YYYY-MM-DD");
			end = moment().add(3, 'months').format("YYYY-MM-DD");
			maxWorkload = defaultMaxWorkload;
			daysBeforeReset = defaultDaysBeforeReset;
			intervals = defaultIntervals;
		} else {
			start = moment(Session.get('activeCardset').learningStart).format("YYYY-MM-DD");
			nextDay = moment(Session.get('activeCardset').learningStart).add(1, 'day').format("YYYY-MM-DD");
			end = moment(Session.get('activeCardset').learningEnd).format("YYYY-MM-DD");
			maxWorkload = Session.get('activeCardset').maxCards;
			daysBeforeReset = Session.get('activeCardset').daysBeforeReset;
			intervals = Session.get('activeCardset').learningInterval;
		}
		dateBonusStart = $('#bonusFormModal #dateBonusStart');
		dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		$('#bonusFormModal #maxWorkload').val(maxWorkload);
		$('#bonusFormModal #daysBeforeReset').val(daysBeforeReset);
		$('#bonusFormModal #interval1').val(intervals[0]);
		$('#bonusFormModal #interval2').val(intervals[1]);
		$('#bonusFormModal #interval3').val(intervals[2]);
		$('#bonusFormModal #interval4').val(intervals[3]);
		$('#bonusFormModal #interval5').val(intervals[4]);
		dateBonusStart.attr("min", start);
		dateBonusStart.attr("max", end);
		dateBonusStart.val(start);
		dateBonusEnd.attr("min", nextDay);
		dateBonusEnd.val(end);
	}
};
