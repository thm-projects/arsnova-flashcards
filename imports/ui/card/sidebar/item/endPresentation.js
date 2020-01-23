import "./endPresentation.html";
import {CardNavigation} from "../../../../api/cardNavigation";

/*
 * ############################################################################
 * cardSidebarItemEndPresentation
 * ############################################################################
 */

Template.cardSidebarItemEndPresentation.events({
	"click .endPresentation": function () {
		CardNavigation.exitPresentation();
	}
});
