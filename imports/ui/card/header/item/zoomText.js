import {Session} from "meteor/session";
import "./zoomText.html";
import {CardVisuals} from "../../../../api/cardVisuals";

/*
 * ############################################################################
 * cardHeaderItemZoomText
 * ############################################################################
 */

Template.cardHeaderItemZoomText.onRendered(function () {
	CardVisuals.zoomCardText();
});

Template.cardHeaderItemZoomText.helpers({
	getButtonColor: function () {
		if (Session.get('zoomTextContainerVisible')) {
			return 'pressed';
		} else if (Session.get('currentZoomValue') !== CardVisuals.getDefaultTextZoomValue()) {
			return 'active';
		}
	}
});

Template.cardHeaderItemZoomText.events({
	"click .zoomTextButton": function () {
		CardVisuals.toggleZoomContainer();
	}
});
