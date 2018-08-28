import {Meteor} from "meteor/meteor";
import {BonusForm} from "../../api/bonusForm";
import "./bonusForm.html";

/*
* ############################################################################
* bonusForm
* ############################################################################
*/

Template.bonusForm.onRendered(function () {
	$('#bonusFormModal').on('show.bs.modal', function () {
		BonusForm.cleanModal();
	});
	$('#bonusFormModal').on('hidden.bs.modal', function () {
		BonusForm.cleanModal();
	});
});

Template.bonusForm.events({
	"click #startBonus": function () {
		let maxCards = $('#bonusFormModal #maxWorkload').val();
		let daysBeforeReset = $('#bonusFormModal #daysBeforeReset').val();
		let learningStart = new Date($('#bonusFormModal #dateBonusStart').val());
		let learningEnd = new Date($('#bonusFormModal #dateBonusEnd').val());
		let learningInterval = [];
		for (let i = 0; i < 5; ++i) {
			learningInterval[i] = $('#bonusFormModal #interval' + (i + 1)).val();
		}
		if (!learningInterval[0]) {
			learningInterval[0] = 1;
		}
		for (let i = 1; i < 5; ++i) {
			if (!learningInterval[i]) {
				learningInterval[i] = (parseInt(learningInterval[i - 1]) + 1);
			}
		}

		Meteor.call("activateLearning", Router.current().params._id, maxCards, daysBeforeReset, learningStart, learningEnd, learningInterval);
		$('#bonusFormModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});

/*
* ############################################################################
* bonusFormMaxWorkload
* ############################################################################
*/

Template.bonusFormMaxWorkload.events({
	"input #maxCards": function () {
		if (parseInt($('#bonusFormModal #maxWorkload').val()) <= 0) {
			$('#bonusFormModal #maxWorkload').val(1);
		} else if (parseInt($('#bonusFormModal #maxWorkload').val()) > 100) {
			$('#bonusFormModal #maxWorkload').val(100);
		}
	}
});

/*
* ############################################################################
* bonusFormDaysBeforeReset
* ############################################################################
*/

Template.bonusFormDaysBeforeReset.events({
	"input #daysBeforeReset": function () {
		if (parseInt($('#bonusFormModal #daysBeforeReset').val()) <= 0) {
			$('#bonusFormModal #daysBeforeReset').val(1);
		} else if (parseInt($('#bonusFormModal #daysBeforeReset').val()) > 100) {
			$('#bonusFormModal #daysBeforeReset').val(100);
		}
	}
});

/*
* ############################################################################
* bonusFormStartEndDate
* ############################################################################
*/

Template.bonusFormStartEndDate.events({
	"input #dateBonusStart": function () {
		const start = new Date($('#bonusFormModal #dateBonusStart').val());
		const end = new Date($('#bonusFormModal #dateBonusEnd').val());
		if (isNaN(start.getTime()) || start < new Date()) {
			const today = new Date();
			$('#bonusFormModal #dateBonusStart').val(today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + "-" + (today.getDate() < 10 ? '0' : '') + end.getDate());
		}
		if (start >= end) {
			end.setDate(end.getDate() - 1);
			$('#bonusFormModal #dateBonusStart').val(end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? '0' : '') + end.getDate());
		}
		$('#bonusFormModal #dateBonusEnd').attr("min", (start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()));
	},
	"input #dateBonusEnd": function () {
		const start = new Date($('#bonusFormModal #dateBonusStart').val());
		let end = new Date($('#bonusFormModal #dateBonusEnd').val());
		if (isNaN(end.getTime()) || start >= end) {
			end = start;
			end.setDate(end.getDate() + 1);
			$('#bonusFormModal #dateBonusEnd').val(end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? '0' : '') + end.getDate());
		}
		$('#bonusFormModal #dateBonusStart').attr("max", (end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + (end.getDate() - 1)));
	}
});

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"input #interval1, input #interval2, input #interval3, input #interval4, input #interval5": function () {
		var error = false;
		for (let i = 1; i < 5; ++i) {
			if (parseInt($('#bonusFormModal #interval' + i).val()) <= 0) {
				$('#bonusFormModal #interval' + i).val(1);
			} else if (parseInt($('#bonusFormModal #interval' + i).val()) > 999) {
				$('#bonusFormModal #interval' + i).val(999);
			}
			if (parseInt($('#bonusFormModal #interval' + i).val()) > parseInt($('#bonusFormModal #interval' + (i + 1)).val())) {
				error = true;
			}
		}
		if (error) {
			for (let j = 1; j <= 5; ++j) {
				$('#bonusFormModal #interval' + j).parent().parent().addClass('has-warning');
				$('#bonusFormModal #errorInterval').html(TAPi18n.__('bonus.form.intervals.error'));
			}
		} else {
			for (let k = 1; k <= 5; ++k) {
				$('#bonusFormModal #interval' + k).parent().parent().removeClass('has-warning');
				$('#bonusFormModal #errorInterval').html('');
			}
		}
	}
});
