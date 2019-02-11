import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import "./zoomText.html";

/*
 * ############################################################################
 * mainOverlayZoomText
 * ############################################################################
 */

Template.mainOverlayZoomText.helpers({
	getPercentage: function () {
		return Session.get('currentZoomValue') + " %";
	},
	isDefaultZoomTextValue: function () {
		return Session.get('currentZoomValue') === CardVisuals.getDefaultTextZoomValue();
	}
});

Template.mainOverlayZoomText.events({
	"click .resetTextZoom": function () {
		CardVisuals.resetCurrentTextZoomValue();
	}
});
