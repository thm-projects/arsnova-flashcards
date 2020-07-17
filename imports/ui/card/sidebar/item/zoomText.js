import {Session} from "meteor/session";
import "./zoomText.html";
import {CardVisuals} from "../../../../util/cardVisuals";

/*
 * ############################################################################
 * cardSidebarItemZoomText
 * ############################################################################
 */

Template.cardSidebarItemZoomText.helpers({
	getButtonColor: function () {
		if (Session.get('zoomTextContainerVisible')) {
			return 'pressed';
		} else if (Session.get('currentZoomValue') !== CardVisuals.getDefaultTextZoomValue()) {
			return 'active';
		}
	}
});

Template.cardSidebarItemZoomText.events({
	"click .zoomTextButton": function () {
		CardVisuals.toggleZoomContainer();
	}
});
