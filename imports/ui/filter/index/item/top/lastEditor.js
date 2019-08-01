import "./lastEditor.html";
import {Template} from "meteor/templating";
import {Route} from "../../../../../api/route";

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

Template.filterIndexItemTopLastEditor.events({
	'click .lastEditorLink': function () {
		Router.go('admin_user', {
			_id: this.lastEditor
		});
	}
});
