import "./right.html";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

/*
 * ############################################################################
 * flashcardHeaderEditorRight
 * ############################################################################
 */

Template.flashcardHeaderEditorRight.helpers({
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});
