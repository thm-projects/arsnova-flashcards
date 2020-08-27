import {Template} from "meteor/templating";
import {Route} from "../../../../util/route";
import {Session} from "meteor/session";
import {AspectRatio} from "../../../../util/aspectRatio";
import * as config from "../../../../config/firstTimeVisit.js";
import "../../../presentation/presentation.js";
import "./demo.html";

/*
 * ############################################################################
 * demo
 * ############################################################################
 */

Template.demo.onCreated(function () {
	Session.set('aspectRatioMode', AspectRatio.getDefault());
});

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit() && config.firstTimeVisitDemoTitle;
	}
});
