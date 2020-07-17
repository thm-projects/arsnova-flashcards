import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Session} from "meteor/session";
import {Utilities} from "../../../util/utilities";

// Returns the locale date
Template.registerHelper("getDateUpdated", function () {
	let dateUpdated;
	if (FlowRouter.getRouteName() === "welcome") {
		dateUpdated = Session.get('wordcloudItem')[11];
	} else {
		dateUpdated = this.dateUpdated;
	}
	return moment(dateUpdated).locale(Session.get('activeLanguage')).format('LL');
});

// Returns the locale date with time
Template.registerHelper("getTimestamp", function () {
	return moment(this.date).locale(Session.get('activeLanguage')).format('LLLL');
});

// Returns the locale date
Template.registerHelper("getDate", function () {
	let date;
	if (FlowRouter.getRouteName() === "welcome") {
		date = Session.get('wordcloudItem')[10];
	} else {
		date = this.date;
	}
	return moment(date).locale(Session.get('activeLanguage')).format('LL');
});

Template.registerHelper("getMomentsDate", function (date, displayMinutes = false, displayMode = 0, transformToSpeech = true) {
	return Utilities.getMomentsDate(date, displayMinutes, displayMode, transformToSpeech);
});

Template.registerHelper("getMomentsDateShort", function (date) {
	return Utilities.getMomentsDateShort(date);
});
