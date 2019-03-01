import {CardVisuals} from "../../../../api/cardVisuals";
import "./aspectRatio.html";

/*
 * ############################################################################
 * cardSidebarItemAspectRatio
 * ############################################################################
 */


Template.cardSidebarItemAspectRatio.events({
	"click .aspect-ratio-button": function () {
		CardVisuals.toggleAspectRatioContainer();
	}
});
