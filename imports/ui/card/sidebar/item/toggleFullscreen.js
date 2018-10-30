import {Session} from "meteor/session";
import "./toggleFullscreen.html";
import {CardVisuals} from "../../../../api/cardVisuals";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";
import {Route} from "../../../../api/route";
import {Template} from "meteor/templating";

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
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
		}
		CardVisuals.toggleFullscreen();
		if (Route.isDemo() && CardVisuals.isFullscreen()) {
			PomodoroTimer.start();
		} else if (PomodoroTimer.isPomodoroRunning()) {
			PomodoroTimer.clickClock();
		}
	}
});
