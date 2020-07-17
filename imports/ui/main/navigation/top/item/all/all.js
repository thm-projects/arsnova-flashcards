import "./item/cardsets.js";
import "./item/repetitorien.js";
import "./all.html";
import {Template} from "meteor/templating";
import {ServerStyle} from "../../../../../../util/styles";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../../../util/routeNames";

Template.mainNavigationTopItemAll.events({
	'click #navbar-all': function () {
		if (ServerStyle.gotSimplifiedNav()) {
			FlowRouter.go(RouteNames.alldecks);
		}
	}
});
