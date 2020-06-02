//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./editors.html";

/*
* ############################################################################
* cardsetManageEditors
* ############################################################################
*/

Template.cardsetManageEditors.helpers({
	getEditors: function () {
		return Session.get("editorsList");
	}
});

Template.cardsetManageEditors.events({
	"click #backButton": function () {
		FlowRouter.go('cardsetdetailsid', {_id: FlowRouter.getParam('_id')});
	},
	"click .addEditor": function (event) {
		Meteor.call("addEditor", FlowRouter.getParam('_id'), $(event.target).data('id'));
	},
	"click .removeEditor": function (event) {
		Meteor.call("removeEditor", FlowRouter.getParam('_id'), $(event.target).data('id'));
	}
});

Template.cardsetManageEditors.created = function () {
	Session.set("editorsList", "");
	Meteor.call("getEditors", FlowRouter.getParam('_id'), function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for editors');
		}
		if (result) {
			Session.set("editorsList", result);
		}
	});
};
