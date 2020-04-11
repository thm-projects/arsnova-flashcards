import {Session} from "meteor/session";
import "./matomoStatistics.html";

Session.setDefault('getMatomoToken', '');


Template.admin_matomoStatistics.onCreated(function () {
	Meteor.call("getMatomoToken", function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for matomo settings');
		}
		if (result) {
			Session.set("getMatomoToken", result);
		}
	});
});

Template.admin_matomoStatistics.helpers({
	getToken: function () {
		return Session.get('getMatomoToken');
	},
	getURL: function () {
		return Meteor.settings.public.matomo.MATOMO_URL;
	}
});


