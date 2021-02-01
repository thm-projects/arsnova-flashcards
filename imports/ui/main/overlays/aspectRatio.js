import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Icons} from "../../../util/icons";
import {CardVisuals} from "../../../util/cardVisuals.js";
import {AspectRatio} from "../../../util/aspectRatio.js";
import "./aspectRatio.html";


/*
 * ############################################################################
 * mainOverlayAspectRatio
 * ############################################################################
 */

Template.mainOverlayAspectRatio.events({
	"click .aspect-ratio-dropdown-button": function (event) {
		Session.set('aspectRatioMode', $(event.currentTarget).attr("data-id"));
		CardVisuals.resizeFlashcard();
	}
});

/*
 * ############################################################################
 * mainOverlayAspectRatioContent
 * ############################################################################
 */


Template.mainOverlayAspectRatioContent.helpers({
	aspectRatios: function () {
		return AspectRatio.getAspectRatios();
	},
	getItem: function () {
		let aspectRatio;
		switch (this) {
			case "fill":
			case "din":
				aspectRatio = this;
				break;
			default:
				aspectRatio = this.replace(":", "");

		}
		return "<li class='aspect-ratio-dropdown-button aspect-ratio' data-id='" + this + "'> <span class ='" + Icons.aspectRatio(aspectRatio) + "' data-id='" + this + "'></span>&nbsp;" +  TAPi18n.__('presentation.aspectRatio.' + aspectRatio) + "</li>";
	}
});
