import "./lastEditor.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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

Template.filterIndexItemTopLastEditor.events({
	'click .lastEditorLink': function () {
		FlowRouter.go('admin_user', {
			_id: this.lastEditor
		});
	}
});
