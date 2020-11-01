//------------------------ IMPORTS
import "./pomodoroTimer.html";
import {Template} from "meteor/templating";
import {PomodoroTimer} from "../../util/pomodoroTimer";
import {Bonus} from "../../util/bonus";
import {Route} from "../../util/route";
import {CardVisuals} from "../../util/cardVisuals";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {ReactiveVar} from "meteor/reactive-var";

Session.set('pomodoroSoundConfig', [true, true, true]);
let fullscreenConfig = new ReactiveVar();

/*
 * ############################################################################
 * pomodoroTimer
 * ############################################################################
 */

Template.pomodoroTimer.onCreated(function () {
	/*This initializes the tooltip over "pomodoro" in the startup modal.*/
	$('[data-toggle="tooltip"]').tooltip();
	PomodoroTimer.startInterval();
});

Template.pomodoroTimer.onRendered(function () {
	if (Route.isPresentation() || Route.isBox() || Route.isMemo() || Route.isDemo()) {
		CardVisuals.resizeFlashcard();
	}
	$('.pomodoroTimer').bind().on('click', function () {
		PomodoroTimer.clickClock();
	});
	CardVisuals.setPomodoroTimerSize();
	PomodoroTimer.updateArcs();
});

Template.pomodoroTimer.onDestroyed(function () {
	PomodoroTimer.clearInterval();
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
		PomodoroTimer.initializeVariables();
		PomodoroTimer.initializeModalContent();
		Session.set('pomodoroSoundConfig', [PomodoroTimer.getSoundConfig()[0], PomodoroTimer.getSoundConfig()[1], PomodoroTimer.getSoundConfig()[2]]);
		fullscreenConfig.set(PomodoroTimer.getFullscreenConfig());
	});
	$('#pomodoroTimerModal').on('shown.bs.modal', function () {
		CardVisuals.setSidebarPosition();
	});
	if (Route.requiresUserInputForFullscreen()) {
		if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
			PomodoroTimer.start();
		} else {
			if (!PomodoroTimer.isPomodoroRunning()) {
				if (Route.isDefaultPresentation() || Route.isPresentationList()) {
					PomodoroTimer.initializeVariables();
					PomodoroTimer.initializeModalContent();
					PomodoroTimer.start();
				} else {
					$('#pomodoroTimerModal').modal('show');
				}
			}
		}
	}
});

Template.pomodoroTimerModal.helpers({
	requiresUserInputForFullscreen: function () {
		if (!Route.isPresentation()) {
			return Route.requiresUserInputForFullscreen();
		}
	}
});

Template.pomodoroTimerModal.events({
	'click #settingsBtn': function () {
		PomodoroTimer.updateSettingsBtn();
	},
	'click #startPom': function () {
		PomodoroTimer.start();
	},
	'click .closePomodoro': function () {
		PomodoroTimer.setPresentationPomodoro(true);
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
		return !Route.isCardset() && !Route.isPresentation() && !Route.isDemo();
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
	}
});

/*
 * ############################################################################
 * pomodoroTimerModalContentCheckbox
 * ############################################################################
 */

Template.pomodoroTimerModalContentCheckbox.events({
	'click #sound1': function () {
		PomodoroTimer.clockHandler(0);
		let soundConfig = Session.get('pomodoroSoundConfig');
		soundConfig[0] = PomodoroTimer.getSoundConfig()[0];
		Session.set('pomodoroSoundConfig', soundConfig);
	},
	'click #sound2': function () {
		PomodoroTimer.clockHandler(1);
		let soundConfig = Session.get('pomodoroSoundConfig');
		soundConfig[1] = PomodoroTimer.getSoundConfig()[1];
		Session.set('pomodoroSoundConfig', soundConfig);
	},
	'click #sound3': function () {
		PomodoroTimer.clockHandler(2);
		let soundConfig = Session.get('pomodoroSoundConfig');
		soundConfig[2] = PomodoroTimer.getSoundConfig()[2];
		Session.set('pomodoroSoundConfig', soundConfig);
	},
	'click #fullscreenPomodoro': function () {
		PomodoroTimer.clockHandler(3);
		fullscreenConfig.set(PomodoroTimer.getFullscreenConfig());
	}
});

Template.pomodoroTimerModalContentCheckbox.helpers({
	gotChecked: function (item) {
		switch (item) {
			case "sound1":
				return Session.get('pomodoroSoundConfig')[0];
			case "sound2":
				return Session.get('pomodoroSoundConfig')[1];
			case "sound3":
				return Session.get('pomodoroSoundConfig')[2];
			case "fullscreenPomodoro":
				return fullscreenConfig.get();
		}
	}
});
