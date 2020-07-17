import {Session} from "meteor/session";
import {CardVisuals} from "../../../util/cardVisuals";
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
	},
	reachedMax: function () {
		if (Session.get('currentZoomValue') >= CardVisuals.getMaxTextZoomValue()) {
			return "disabled";
		}
	},
	reachedMin: function () {
		if (Session.get('currentZoomValue') <= CardVisuals.getMinTextZoomValue()) {
			return "disabled";
		}
	}
});

Template.mainOverlayZoomText.events({
	"click .resetTextZoom": function () {
		CardVisuals.resetCurrentTextZoomValue();
	},
	"click .zoomTextIncrease": function () {
		CardVisuals.zoomCardText();
	},
	"click .zoomTextDecrease": function () {
		CardVisuals.zoomCardText(false);
	}
});
