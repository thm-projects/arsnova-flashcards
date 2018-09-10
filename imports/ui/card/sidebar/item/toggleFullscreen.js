import {Session} from "meteor/session";
import "./toggleFullscreen.html";
import {CardVisuals} from "../../../../api/cardVisuals";

/*
 * ############################################################################
 * cardSidebarItemToggleFullscreen
 * ############################################################################
 */

Template.cardSidebarItemToggleFullscreen.events({
	"click .toggleFullscreen": function () {
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
		}
		CardVisuals.toggleFullscreen();
	}
});
