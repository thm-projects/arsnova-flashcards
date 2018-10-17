import "./pomodoroButton.html";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";

/*
 * ############################################################################
 * cardSidebarItemPomodoroButton
 * ############################################################################
 */

Template.cardSidebarItemPomodoroButton.events({
	"click .showPomodoroButton": function () {
		PomodoroTimer.clickClock();
	}
});

Template.cardSidebarItemPomodoroButton.helpers({
	pomodoroActive: function () {
		return PomodoroTimer.isPresentationPomodoroActive();
	}
});
