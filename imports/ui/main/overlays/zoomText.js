import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import "./zoomText.html";

/*
 * ############################################################################
 * zoomTextOverlay
 * ############################################################################
 */

Template.zoomTextOverlay.helpers({
	getPercentage: function () {
		return Session.get('currentZoomValue') + " %";
	},
	isDefaultZoomTextValue: function () {
		return Session.get('currentZoomValue') === CardVisuals.getDefaultTextZoomValue();
	}
});

Template.zoomTextOverlay.events({
	"click .resetTextZoom": function () {
		CardVisuals.resetCurrentTextZoomValue();
	}
});
