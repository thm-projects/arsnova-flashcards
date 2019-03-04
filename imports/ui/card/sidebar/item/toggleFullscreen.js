import {Session} from "meteor/session";
import "./toggleFullscreen.html";
import {CardVisuals} from "../../../../api/cardVisuals";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";
import {Route} from "../../../../api/route";
import {Template} from "meteor/templating";
import {Dictionary} from "../../../../api/dictionary";
import {FirstTimeVisit} from "../../../../api/firstTimeVisit";
import {AspectRatio} from "../../../../api/aspectRatio";

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
				Router.go('home');
			}
		}
	}
});
