import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";

//------------------------ GET LANGUAGE FROM USER

export function getUserLanguage() {
	let language;
	if (Meteor.userId()) {
		language = Meteor.users.findOne(Meteor.userId()).profile.locale;
	} else {
		language = navigator.language.substr(0, 2);
	}
	Session.set('activeLanguage', language);
}


//------------------------ LOADING I18N

Meteor.startup(function () {
	Meteor.absoluteUrl.defaultOptions.rootUrl = Meteor.settings.public.rooturl;

	Session.set("showLoadingIndicator", true);

	Meteor.subscribe("userData", {
		onReady: function () {
			getUserLanguage();
			TAPi18n.setLanguage(Session.get('activeLanguage'))
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
