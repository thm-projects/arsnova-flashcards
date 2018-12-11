import "./displayModeButton.html";
import {Session} from "meteor/session";
import {Filter} from "../../../../api/filter";
import {Route} from "../../../../api/route";
import {WordcloudCanvas} from "../../../../api/wordcloudCanvas";
import ResizeSensor from "../../../../../client/thirdParty/resizeSensor/ResizeSensor";
Session.setDefault('filterDisplayWordcloud', false);

/*
 * ############################################################################
 * filterItemDisplayModeButton
 * ############################################################################
 */

Template.filterItemDisplayModeButton.onRendered(function () {
	if (Route.isAllCardsets()) {
		WordcloudCanvas.disableWordcloud();
	} else {
		WordcloudCanvas.setDefaultView();
	}
	new ResizeSensor($('#filter-nav-wrapper'), function () {
		if (!Route.isAllCardsets()) {
			WordcloudCanvas.setDefaultView();
		}
	});
});

Template.filterItemDisplayModeButton.helpers({
	isWordcloudActive: function () {
		return Session.get('filterDisplayWordcloud');
	}
});

Template.filterItemDisplayModeButton.events({
	'click #displayModeBtn': function () {
		if (Session.get('filterDisplayWordcloud')) {
			Filter.resetInfiniteBar();
			WordcloudCanvas.disableWordcloud();
		} else {
			WordcloudCanvas.enableWordcloud();
		}
	}
});

Template.filterItemDisplayModeButton.onDestroyed(function () {
	WordcloudCanvas.disableWordcloud();
});
