import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import "./aspectRatio.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * mainOverlayAspectRatioContent
 * ############################################################################
 */

Template.mainOverlayAspectRatioContent.events({
	"click .aspect-ratio-16-9": function () {
		Session.set('aspectRatioMode', 0);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	},
	"click .aspect-ratio-4-3": function () {
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
	"click .aspect-ratio-card": function () {
		Session.set('aspectRatioMode', 3);
		if (Route.isCardset()) {
			Router.go('presentation', {_id: this._id});
		}
	}
});
