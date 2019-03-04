import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import {Session} from "meteor/session";
import * as config from "../../../config/cardVisuals.js";
import {Icons} from "../../../api/icons";
import "./aspectRatio.html";

/*
 * ############################################################################
 * mainOverlayAspectRatioContent
 * ############################################################################
 */


Template.mainOverlayAspectRatioContent.helpers({
	aspectRatios: function () {
		return config.aspectRatios;
	},
	getItem: function () {
		let aspectRatio;
		switch (this) {
			case "stretched":
			case "din":
				aspectRatio = this;
				break;
			default:
				aspectRatio = this.replace(":", "");

		}
		return "<li class='aspect-ratio-dropdown-button aspect-ratio-" + aspectRatio + "'>" + Icons.aspectRatio(aspectRatio) +  TAPi18n.__('presentation.aspectRatio.' + aspectRatio) + "</li>";
	}
});

Template.mainOverlayAspectRatioContent.events({
	"click .aspect-ratio-169": function () {
		Session.set('aspectRatioMode', 0);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	},
	"click .aspect-ratio-43": function () {
		Session.set('aspectRatioMode', 1);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	},
	"click .aspect-ratio-stretched": function () {
		Session.set('aspectRatioMode', 2);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	},
	"click .aspect-ratio-din": function () {
		Session.set('aspectRatioMode', 3);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	}
});
