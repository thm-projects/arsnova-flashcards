import "./errorReporting.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";

Template.cardsetLabelsItemErrorReporting.events({
	'click .show-error': function (event) {
		Session.set('showOnlyErrorReports', true);
		$('#useCasesModal').modal('hide');
		FlowRouter.go(RouteNames.presentationlist, {_id: $(event.target).data('id')});
	}
});

Template.cardsetLabelsItemErrorReporting.helpers({
	cardsetErrorCount: function () {
		if (this.unresolvedErrors === undefined) {
			return 0;
		} else {
			return this.unresolvedErrors;
		}
	}
});
