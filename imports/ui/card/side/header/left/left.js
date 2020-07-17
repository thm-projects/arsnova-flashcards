import "./left.html";
import {PomodoroTimer} from "../../../../../util/pomodoroTimer";

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

/*
 * ############################################################################
 * flashcardHeaderLeitnerLeft
 * ############################################################################
 */

Template.flashcardHeaderLeitnerLeft.helpers({
	pomodoroActive: function () {
		return PomodoroTimer.isPresentationPomodoroActive();
	}
});

/*
 * ############################################################################
 * flashcardHeaderWozniakLeft
 * ############################################################################
 */

Template.flashcardHeaderWozniakLeft.helpers({
	pomodoroActive: function () {
		return PomodoroTimer.isPresentationPomodoroActive();
	}
});
