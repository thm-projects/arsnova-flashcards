import {Session} from "meteor/session";

Template.registerHelper("isActiveLanguage", function (language) {
	if (Session.get('activeLanguage') === undefined) {
		Session.set('activeLanguage', 'de');
	}
	return Session.get('activeLanguage') === language;
});

// Returns if user is deleted or not
Template.registerHelper("userExists", function (userDeleted) {
	return userDeleted !== true;
});
