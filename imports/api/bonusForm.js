let defaultMaxWorkload = null;
let defaultDaysBeforeReset = null;
let defaultIntervals = [1, 3, 7, 28, 84];

export let BonusForm = class BonusForm {
	static cleanModal () {
		let start = moment().format("YYYY-MM-DD");
		let nextDay = moment().add(1, 'day').format("YYYY-MM-DD");
		let end = moment().add(3, 'months').format("YYYY-MM-DD");
		let dateBonusStart = $('#bonusFormModal #dateBonusStart');
		let dateBonusEnd = $('#bonusFormModal #dateBonusEnd');
		dateBonusStart.attr("min", start);
		dateBonusStart.attr("max", end);
		dateBonusStart.val(start);
		dateBonusEnd.attr("min", nextDay);
		dateBonusEnd.val(end);
		$('#bonusFormModal #maxWorkload').val(defaultMaxWorkload);
		$('#bonusFormModal #daysBeforeReset').val(defaultDaysBeforeReset);
		$('#bonusFormModal #interval1').val(defaultIntervals[0]);
		$('#bonusFormModal #interval2').val(defaultIntervals[1]);
		$('#bonusFormModal #interval3').val(defaultIntervals[2]);
		$('#bonusFormModal #interval4').val(defaultIntervals[3]);
		$('#bonusFormModal #interval5').val(defaultIntervals[4]);
	}
};
