import "./endPresentation.html";
import {CardNavigation} from "../../../../util/cardNavigation";

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
