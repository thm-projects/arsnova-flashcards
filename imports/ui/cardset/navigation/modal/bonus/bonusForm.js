import {Session} from "meteor/session";
import {BonusForm} from "../../../../../api/bonusForm";
import "./bonusForm.html";
import "./item/daysBeforeReset.js";
import "./item/endDate.js";
import "./item/maxBonusPoints.js";
import "./item/openSimulator.js";
import "./item/registrationPeriod.js";
import "./item/startDate.js";
import "./completeProfile/completeProfile.js";
import "./join/join.js";
import "./leave/leave.js";
import {PomodoroTimer} from "../../../../../api/pomodoroTimer";

/*
* ############################################################################
* bonusForm
* ############################################################################
*/

Template.bonusForm.onRendered(function () {
	BonusForm.cleanModal();
	$('#bonusFormModal').on('show.bs.modal', function () {
		BonusForm.cleanModal();
		PomodoroTimer.initializeVariables();
		PomodoroTimer.initializeModalContent();
	});
	$('#bonusFormModal').on('hidden.bs.modal', function () {
		BonusForm.cleanModal();
		PomodoroTimer.initializeVariables();
		PomodoroTimer.initializeModalContent();
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
		PomodoroTimer.initializeVariables();
		PomodoroTimer.initializeModalContent();
	}
});
