//------------------------ IMPORTS
import "./pomodoroTimer.html";
import {Template} from "meteor/templating";
import {PomodoroTimer} from "../../api/pomodoroTimer";

/*
 * ############################################################################
 * pomodoroTimer
 * ############################################################################
 */
let promodoroInterval;
Template.pomodoroTimer.onCreated(function () {
	/*This initializes the tooltip over "pomodoro" in the startup modal.*/
	$('[data-toggle="tooltip"]').tooltip();
	if (promodoroInterval === undefined) {
		promodoroInterval = setInterval(function () {
			PomodoroTimer.interval();
		}, 1000);
	}
});

Template.pomodoroTimer.events({
	'click #clock': function () {
		PomodoroTimer.clickClock();
	}
});

/*
 * ############################################################################
 * pomodoroTimerModal
 * ############################################################################
 */

Template.pomodoroTimerModal.onRendered(function () {
	$("#pomodoroTimerModal").on('hidden.bs.modal', function () {
		PomodoroTimer.start();
	});
});

Template.pomodoroTimerModal.events({
	'input #pomNumSlider': function () {
		PomodoroTimer.updatePomNumSlider();
	},
	'input #pomQuantity': function () {
		PomodoroTimer.updatePomQuantity();
	},
	'click #settingsBtn': function () {
		PomodoroTimer.updateSettingsBtn();
	},
	'input #workLength': function () {
		PomodoroTimer.updateWorkLength();
	},
	'input #workSlider': function () {
		PomodoroTimer.updateWorkSlider();
	},
	'input #playLength': function () {
		PomodoroTimer.updatePlayLength();
	},
	'input #playSlider': function () {
		PomodoroTimer.updatePlaySlider();
	},
	'click #clockPreview': function () {
		document.getElementById("bell").play();
	},
	'click #completePreview': function () {
		document.getElementById("success").play();
	},
	'click #cancelPreview': function () {
		document.getElementById("failure").play();
	},
	'change #sound1': function () {
		if (document.getElementById("sound1").checked) {
			document.getElementById("bell").play();
		}
	}
});
