import "./right.html";
import {MarkdeepEditor} from "../../../../../util/markdeepEditor";

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
