import "./left.html";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

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
