import "./errorReporting.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import {ErrorReporting} from "../../../../util/errorReporting";

Template.cardsetLabelsItemErrorReporting.events({
	'click .show-error': function (event) {
		Session.set('showOnlyErrorReports', true);
		FlowRouter.go(RouteNames.presentationlist, {_id: $(event.target).data('id')});
	}
});

Template.cardsetLabelsItemErrorReporting.helpers({
	hasCardsetUnresolvedErrors: function (cardset_id) {
		return ErrorReporting.getErrorCountFromCardset(cardset_id) > 0;
	},
	getErrorCountFromCardset: function (cardset_id) {
		return ErrorReporting.getErrorCountFromCardset(cardset_id);
	}
});
