//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./originalAuthor.html";

/*
* ############################################################################
* cardsetInfoBoxItemOriginalAuthor
* ############################################################################
*/

Template.cardsetInfoBoxItemOriginalAuthor.helpers({
	gotOriginalAuthorData: function () {
		if (this.originalAuthorName !== undefined) {
			return (this.originalAuthorName.birthname !== undefined || this.originalAuthorName.legacyName !== undefined);
		} else {
			return "";
		}
	}
});
