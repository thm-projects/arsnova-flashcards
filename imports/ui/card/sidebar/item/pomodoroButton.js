import "./pomodoroButton.html";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";

/*
 * ############################################################################
 * cardSidebarItemPomodoroButton
 * ############################################################################
 */

Template.cardSidebarItemPomodoroButton.events({
	"click .showPomodoroButton": function () {
		PomodoroTimer.setPresentationPomodoro();
	}
});

Template.cardSidebarItemPomodoroButton.helpers({
	pomodoroActive: function () {
		return PomodoroTimer.isPresentationPomodoroActive();
	}
});
