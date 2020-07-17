import "./item/cardsets.js";
import "./item/repetitorien.js";
import "./public.html";
import {Template} from "meteor/templating";
import {ServerStyle} from "../../../../../../util/styles";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../../../util/routeNames";


/*
* ############################################################################
* mainNavigationTopItemPublic
* ############################################################################
*/

Template.mainNavigationTopItemPublic.helpers({
	gotBothNavigationElements: function () {
		return ServerStyle.gotNavigationFeature("public.cardset.enabled") && ServerStyle.gotNavigationFeature("public.repetitorium.enabled");
	}
});

Template.mainNavigationTopItemPublic.events({
	'click #navbar-public': function () {
		if (ServerStyle.gotSimplifiedNav()) {
			FlowRouter.go(RouteNames.pool);
		}
	}
});
