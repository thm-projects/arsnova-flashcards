//------------------------ IMPORTS
import "./pomodoroTimer.html";
import {Template} from "meteor/templating";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {NavigatorCheck} from "../../api/navigatorCheck";

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

Template.pomodoroTimer.helpers({
	getHourRotation: function () {
		return 'rotate(' + PomodoroTimer.getHourRotation() + ' 50 50)';
	},
	getMinuteRotation: function () {
		return 'rotate(' + PomodoroTimer.getMinuteRotation() + ' 50 50)';
	}
});

Template.pomodoroTimer.events({
	'click .pomodoroClock': function () {
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

Template.pomodoroTimerModal.helpers({
	isiOS: function () {
		return NavigatorCheck.isIOS();
	}
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
	'change #sound1': function () {
		PomodoroTimer.clockHandler(0);
	},
	'change #sound2': function () {
		PomodoroTimer.clockHandler(1);
	},
	'change #sound3': function () {
		PomodoroTimer.clockHandler(2);
	}
});
