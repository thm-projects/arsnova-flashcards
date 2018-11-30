import "./left.html";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";

/*
 * ############################################################################
 * flashcardHeaderPresentationLeft
 * ############################################################################
 */

Template.flashcardHeaderPresentationLeft.helpers({
	pomodoroActive: function () {
		return PomodoroTimer.isPresentationPomodoroActive();
	}
});
