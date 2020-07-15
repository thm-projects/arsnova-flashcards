import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../../../util/routeNames.js";
import {Session} from "meteor/session";
import "./index.html";
import {CardType} from "../../../../../../api/cardTypes";
import {UserPermissions} from "../../../../../../api/permissions";

Template.filterIndexItemBottomIndex.helpers({
	canDisplayIndex: function () {
		return this.quantity > 1 && !CardType.isTranscriptModeOnlyCardType(this.cardType) && UserPermissions.hasCardsetPermission(this._id);
	}
});

Template.filterIndexItemBottomIndex.events({
	'click .cardsetIndex': function (event) {
		Session.set('filterIndexSelectMode', FlowRouter.current().route.name);
		FlowRouter.go(RouteNames.presentationlist, {_id: $(event.target).data('id')});
	}
});

