import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";
import {Session} from "meteor/session";
import {AspectRatio} from "../../../../api/aspectRatio";
import * as config from "../../../../config/firstTimeVisit.js";
import "../../../presentation/presentation.js";
import "./demo.html";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";
import {ServerStyle} from "../../../../api/styles";

/*
 * ############################################################################
 * demo
 * ############################################################################
 */

Template.demo.onCreated(function () {
	Session.set('aspectRatioMode', AspectRatio.getDefault());
});

Template.demo.onRendered(function () {
	if (ServerStyle.gotDemoAutoFullscreen()) {
		setTimeout(function () {
			PomodoroTimer.start();
		}, 250);
	}
});

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit() && config.firstTimeVisitDemoTitle;
	}
});
