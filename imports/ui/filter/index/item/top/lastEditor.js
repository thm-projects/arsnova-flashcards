import "./lastEditor.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * filterIndexItemTopLastEditor
 * ############################################################################
 */

Template.filterIndexItemTopLastEditor.helpers({
	isNotOwner: function () {
		if (this.lastEditor !== undefined) {
			return this.owner !== this.lastEditor;
		}
	}
});
