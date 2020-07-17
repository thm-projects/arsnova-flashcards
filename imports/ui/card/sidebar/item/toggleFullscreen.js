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
		if (Route.isDemo()) {
			Session.set('aspectRatioMode', AspectRatio.getDefault());
		}
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
		}
		CardVisuals.toggleFullscreen();
		if (Route.isEditMode()) {
			Dictionary.setMode(0);
		}
		if (Route.isDemo() && CardVisuals.isFullscreen()) {
			PomodoroTimer.start();
		} else {
			if (Route.isFirstTimeVisit() && FirstTimeVisit.redirectToHomeAfterFullscreenExit()) {
				Route.setFirstTimeVisit();
				FlowRouter.go('home');
			}
		}
		setTimeout(function () {
			CardVisuals.resizeFlashcard();
		}, 250);
	}
});
