import "./left.html";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";
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

/*
 * ############################################################################
 * flashcardHeaderEditorLeft
 * ############################################################################
 */

Template.flashcardHeaderEditorLeft.helpers({
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});
