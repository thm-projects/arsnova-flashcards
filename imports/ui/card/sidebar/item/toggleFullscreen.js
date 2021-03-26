import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import "./toggleFullscreen.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {CardVisuals} from "../../../../util/cardVisuals";
import {PomodoroTimer} from "../../../../util/pomodoroTimer";
import {Route} from "../../../../util/route";
import {Template} from "meteor/templating";
import {Dictionary} from "../../../../util/dictionary";
import {FirstTimeVisit} from "../../../../util/firstTimeVisit";
import {AspectRatio} from "../../../../util/aspectRatio";
import {Fullscreen} from "../../../../util/fullscreen";

/*
 * ############################################################################
 * cardSidebarItemToggleFullscreen
 * ############################################################################
 */

Template.cardSidebarItemToggleFullscreen.onRendered(function () {
	if (Route.isDemo() && Session.get('demoFullscreen')) {
		PomodoroTimer.start();
		Session.set('demoFullscreen', false);
	}
});

Template.cardSidebarItemToggleFullscreen.events({
	"click .toggleFullscreen": function () {
		Fullscreen.toggle();

		if (Route.isDemo()) {
			Session.set('aspectRatioMode', AspectRatio.getDefault());

			if (Fullscreen.isActive()) {
				if (!Meteor.userId() && Route.isFirstTimeVisit() && FirstTimeVisit.redirectToHomeAfterFullscreenExit()) {
					Route.setFirstTimeVisit();
					FlowRouter.go('home');
				}
			} else {
				setTimeout(function () {
					PomodoroTimer.start();
				}, 250);
			}
		}

		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
		}

		if (Route.isEditMode()) {
			Dictionary.setMode(0);
		}

		setTimeout(function () {
			CardVisuals.resizeFlashcard();
		}, 250);
	}
});
