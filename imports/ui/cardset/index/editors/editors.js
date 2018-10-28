//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
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
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	},
	"click .addEditor": function (event) {
		Meteor.call("addEditor", Router.current().params._id, $(event.target).data('id'));
	},
	"click .removeEditor": function (event) {
		Meteor.call("removeEditor", Router.current().params._id, $(event.target).data('id'));
	}
});

Template.cardsetManageEditors.created = function () {
	Session.set("editorsList", "");
	Meteor.call("getEditors", Router.current().params._id, function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for editors');
		}
		if (result) {
			Session.set("editorsList", result);
		}
	});
};
