import {Session} from "meteor/session";

// Adds the "disabled" attribute to Elements if the app is offline
// use it like this: <button {{disableIfOffline}}>...</button>
Template.registerHelper("disableIfOffline", function () {
	return Session.get("connectionStatus") === 1 ? "" : "disabled";
});

Template.registerHelper("loadedCardsSettings", function () {
	return Session.get('loadedCardsSettings');
});

Template.registerHelper("oddRow", function (index) {
	return (index % 2 === 1);
});

Template.registerHelper("greaterThan0", function (number) {
	return number > 0;
});
