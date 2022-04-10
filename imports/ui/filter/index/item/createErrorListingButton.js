import "./createErrorListingButton.html";
import {Template} from 'meteor/templating';
import {Session} from "meteor/session";
import "../../../card/modal/errorReportingTable";

/*
 * ############################################################################
 * filterMyErrorsButton
 * ############################################################################
 */

Template.filterMyErrorsButton.events({
	'click #myErrors': function () {
		Session.set('cardType', undefined);
		Meteor.call("getErrorReportingForUser", (_, reportings) => {
			Session.set("errorReportingCard", reportings);
			$('#showOverviewErrorReportsModal').modal('show');
		});
	}
});

Template.filterMyErrorsButton.helpers({
	hasErrorReportings: () => Session.get("errorReportingCard") && Session.get("errorReportingCard").length > 0,
	getErrorReport: () => Session.get("errorReportingCard")
});

Template.filterMyErrorsButton.onCreated(() => {
	Meteor.call("getErrorReportingForUser", (_, reportings) => Session.set("errorReportingCard", reportings));
});
