import {Session} from "meteor/session";
import {BonusForm} from "../../../../../util/bonusForm";
import "./bonusForm.html";
import "./item/daysBeforeReset.js";
import "./item/endDate.js";
import "./item/intervals.js";
import "./item/maxWorkload.js";
import "./item/maxBonusPoints.js";
import "./item/minLearned.js";
import "./item/openSimulator.js";
import "./item/registrationPeriod.js";
import "./item/startDate.js";
import "./item/strictWorkloadTimer.js";
import "./item/forceNotifications.js";
import "./completeProfile/completeProfile.js";
import "./join/join.js";
import "./leave/leave.js";
import {PomodoroTimer} from "../../../../../util/pomodoroTimer";

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
	displayContentOfNewLearningPhaseBonus: function () {
		return Session.get('displayContentOfNewLearningPhaseBonus');
	}
});

Template.bonusForm.events({
	"click #startBonus": function () {
		if (Session.get('displayContentOfNewLearningPhaseBonus')) {
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
