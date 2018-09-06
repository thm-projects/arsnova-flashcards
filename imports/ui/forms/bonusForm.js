import {Session} from "meteor/session";
import {BonusForm} from "../../api/bonusForm";
import "./bonusForm.html";
import {Meteor} from "meteor/meteor";

/*
* ############################################################################
* bonusForm
* ############################################################################
*/

Template.bonusForm.onRendered(function () {
	BonusForm.cleanModal();
	$('#bonusFormModal').on('show.bs.modal', function () {
		BonusForm.cleanModal();
	});
	$('#bonusFormModal').on('hidden.bs.modal', function () {
		BonusForm.cleanModal();
	});
});

Template.bonusForm.helpers({
	isNewBonus: function () {
		return Session.get('isNewBonus');
	}
});

Template.bonusForm.events({
	"click #startBonus": function () {
		if (Session.get('isNewBonus')) {
			BonusForm.startBonus();
		} else {
			BonusForm.updateBonus();
		}
		$('#bonusFormModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	},
	"click #resetBonus": function () {
		BonusForm.cleanModal();
	}
});

/*
* ############################################################################
* bonusFormMaxWorkload
* ############################################################################
*/

Template.bonusFormMaxWorkload.events({
	"input #maxWorkload": function () {
		BonusForm.adjustMaxWorkload();
	}
});

/*
* ############################################################################
* bonusFormDaysBeforeReset
* ############################################################################
*/

Template.bonusFormDaysBeforeReset.events({
	"input #daysBeforeReset": function () {
		BonusForm.adjustDaysBeforeReset();
	}
});

/*
* ############################################################################
* bonusFormStartDate
* ############################################################################
*/

Template.bonusFormStartDate.events({
	"input #dateBonusStart": function () {
		BonusForm.adjustRegistrationPeriod();
	}
});

/*
* ############################################################################
* bonusFormEndDate
* ############################################################################
*/

Template.bonusFormEndDate.events({
	"input #dateBonusEnd": function () {
		BonusForm.adjustRegistrationPeriod();
	}
});

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"input #interval1, input #interval2, input #interval3, input #interval4, input #interval5": function () {
		BonusForm.adjustInterval();
	}
});

/*
* ############################################################################
* joinBonusForm
* ############################################################################
*/

Template.joinBonusForm.events({
	"click #joinBonusConfirm": function () {
		Meteor.call("joinBonus", Session.get('activeCardset')._id);
		$('#joinBonusModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});

/*
* ############################################################################
* leaveBonusForm
* ############################################################################
*/

Template.leaveBonusForm.events({
	"click #leaveBonusConfirm": function () {
		Meteor.call("leaveBonus", Session.get('activeCardset')._id);
		$('#leaveBonusModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
