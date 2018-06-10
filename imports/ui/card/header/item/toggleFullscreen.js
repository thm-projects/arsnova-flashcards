import {Session} from "meteor/session";
import "./toggleFullscreen.html";
import {CardVisuals} from "../../../../api/cardVisuals";

/*
 * ############################################################################
 * cardHeaderItemToggleFullscreen
 * ############################################################################
 */

Template.cardHeaderItemToggleFullscreen.helpers({
	isWorkloadFullscreen: function () {
		return Session.get("workloadFullscreenMode");
	}
});

Template.cardHeaderItemToggleFullscreen.events({
	"click .toggleFullscreen": function () {
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
			CardVisuals.toggleFullscreen();
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			CardVisuals.toggleFullscreen();
		}
	}
});
