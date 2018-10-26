//------------------------ IMPORTS
import "./pomodoroTimer.html";
import {Template} from "meteor/templating";
import {PomodoroTimer} from "../../api/pomodoroTimer";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {Bonus} from "../../api/bonus";
import {Route} from "../../api/route";
import {CardVisuals} from "../../api/cardVisuals";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * pomodoroTimer
 * ############################################################################
 */
let pomodoroInterval;

Template.pomodoroTimer.onCreated(function () {
	/*This initializes the tooltip over "pomodoro" in the startup modal.*/
	$('[data-toggle="tooltip"]').tooltip();
	if (pomodoroInterval === undefined) {
		pomodoroInterval = setInterval(function () {
			PomodoroTimer.interval();
		}, 1000);
	}
});

Template.pomodoroTimer.onRendered(function () {
	if (Route.isPresentation() || Route.isBox() || Route.isMemo() || Route.isDemo()) {
		CardVisuals.resizeFlashcard();
	}
	$('.pomodoroTimer').unbind().on('click', function () {
		PomodoroTimer.clickClock();
	});
});

Template.pomodoroTimer.helpers({
	getHourRotation: function () {
		return 'rotate(' + PomodoroTimer.getHourRotation() + ' 50 50)';
	},
	getMinuteRotation: function () {
		return 'rotate(' + PomodoroTimer.getMinuteRotation() + ' 50 50)';
	}
});

/*
 * ############################################################################
 * pomodoroTimerModal
 * ############################################################################
 */

Template.pomodoroTimerModal.onCreated(function () {
	PomodoroTimer.initializeVariables();
});

Template.pomodoroTimerModal.onRendered(function () {
	$('#pomodoroTimerModal').on('show.bs.modal', function () {
		PomodoroTimer.initializeModalContent();
	});
	if (Route.isBox() || Route.isMemo() || Route.isPresentation()) {
		if (Bonus.isInBonus(Router.current().params._id)) {
			PomodoroTimer.start();
		} else {
			if (!PomodoroTimer.isPomodoroRunning()) {
				$('#pomodoroTimerModal').modal('show');
			}
		}
	}
	$('#pomodoroTimerModal').on('hidden.bs.modal', function () {
		if (Route.isBox() || Route.isMemo() && !PomodoroTimer.isPomodoroRunning()) {
			PomodoroTimer.start();
		}
	});
});

Template.pomodoroTimerModalContent.helpers({
	isiOS: function () {
		return NavigatorCheck.isIOS();
	}
});

Template.pomodoroTimerModal.events({
	'click #settingsBtn': function () {
		PomodoroTimer.updateSettingsBtn();
	},
	'click #startPom': function () {
		if (Route.isPresentation()) {
			CardVisuals.toggleFullscreen();
		}
		PomodoroTimer.start();
	},
	'click #cancelPomodoroBtn': function () {
		$('#pomodoroTimerModal').modal('hide');
		Session.set('presentationPomodoroActive', false);
	}
});

/*
 * ############################################################################
 * pomodoroTimerModalContent
 * ############################################################################
 */

Template.pomodoroTimerModalContent.helpers({
	isHiddenByDefault: function () {
		return !Route.isCardset() && !Route.isPresentation();
	}
});
Template.pomodoroTimerModalContent.events({
	'input #pomNumSlider': function () {
		PomodoroTimer.updatePomNumSlider();
	},
	'input #workSlider': function () {
		PomodoroTimer.updateWorkSlider();
	},
	'input #breakSlider': function () {
		PomodoroTimer.updateBreakSlider();
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
