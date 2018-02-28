import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";

//------------------------ GET LANGUAGE FROM USER

export function getUserLanguage() {
	if (Meteor.userId()) {
		let language = Meteor.users.findOne(Meteor.userId()).selectedLanguage;
		if (language !== undefined) {
			return language;
		} else {
			let navigatorLanguage = navigator.language.substr(0, 2);
			switch (navigatorLanguage) {
				case "de":
					Meteor.call("updateLanguage", "de", Meteor.userId());
					return "de";
				default:
					Meteor.call("updateLanguage", "en", Meteor.userId());
					return "en";
			}
		}
	} else {
		return navigator.language.substr(0, 2);
	}
}


//------------------------ LOADING I18N

Meteor.startup(function () {
	Meteor.absoluteUrl.defaultOptions.rootUrl = Meteor.settings.public.rooturl;

	Session.set("showLoadingIndicator", true);

	Meteor.subscribe("userData", {
		onReady: function () {
			TAPi18n.setLanguage(getUserLanguage())
				.done(function () {
					Session.set("showLoadingIndicator", false);
				})
				.fail(function (error_message) {
					// Handle the situation
					throw new Meteor.Error(error_message, "Can't get User Language");
				});
		}
	});
});
