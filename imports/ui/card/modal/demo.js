import "./demo.html";
import {Template} from "meteor/templating";
import {MainNavigation} from "../../../api/mainNavigation";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import {PomodoroTimer} from "../../../api/pomodoroTimer";

/*
 * ############################################################################
 * demoModal
 * ############################################################################
 */

Template.demoModal.onRendered(function () {
	if (localStorage.getItem(MainNavigation.getFirstTimeDemoString()) !== "true") {
		$('#demoModal').modal('show');
	}
});

Template.demoModal.events({
	"click #demoConfirm": function () {
		$('#demoModal').modal('hide');
		CardVisuals.toggleFullscreen();
		if (Route.isDemo() && CardVisuals.isFullscreen()) {
			PomodoroTimer.start();
		} else {
			PomodoroTimer.clickClock();
		}
		localStorage.setItem(MainNavigation.getFirstTimeDemoString(), "true");
	}
});