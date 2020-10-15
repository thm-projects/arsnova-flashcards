//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import "./notFound.html";

Meteor.subscribe("notifications");

/*
 * ############################################################################
 * notFound
 * ############################################################################
 */

Template.notFound.helpers({
	getCardsetId: function () {
		return FlowRouter.current().params._id;
	},
	getUrl: function () {
		return FlowRouter.current().path;
	}
});

Template.notFound.events({
	'click #back_notFound': function (event) {
		event.preventDefault();
		history.back();
	}
});
