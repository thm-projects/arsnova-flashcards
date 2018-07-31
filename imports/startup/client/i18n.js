import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";

//------------------------ GET LANGUAGE FROM USER

export function getUserLanguage() {
	Session.set('activeLanguage', "de");
	return Session.get('activeLanguage');
}


//------------------------ LOADING I18N

Meteor.startup(function () {
	Meteor.absoluteUrl.defaultOptions.rootUrl = Meteor.settings.public.rooturl;

	TAPi18n.setLanguage(getUserLanguage());
});
