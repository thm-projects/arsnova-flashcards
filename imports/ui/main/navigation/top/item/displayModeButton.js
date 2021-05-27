import "./displayModeButton.html";
import {Session} from "meteor/session";
import {Filter} from "../../../../../util/filter";
import {Route} from "../../../../../util/route";
import {WordcloudCanvas} from "../../../../../util/wordcloudCanvas";
import ResizeSensor from "../../../../../../client/thirdParty/resizeSensor/ResizeSensor";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Session.setDefault('filterDisplayWordcloud', false);

/*
 * ############################################################################
 * mainNavigationTopItemDisplayModeButton
 * ############################################################################
 */

Template.mainNavigationTopItemDisplayModeButton.onRendered(function () {
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

Template.mainNavigationTopItemDisplayModeButton.helpers({
	isWordcloudActive: function () {
		return Session.get('filterDisplayWordcloud');
	}
});

Template.mainNavigationTopItemDisplayModeButton.events({
	'click .displayModeBtn': function () {
		if (Session.get('filterDisplayWordcloud')) {
			Filter.resetMaxItemCounter();
			WordcloudCanvas.disableWordcloud();
			ThemeSwitcher.setTheme();
		} else {
			Filter.resetMaxItemCounter();
			WordcloudCanvas.enableWordcloud();
			ThemeSwitcher.changeToBackgroundStyle("wordcloud");
		}
	}
});

Template.mainNavigationTopItemDisplayModeButton.onDestroyed(function () {
	WordcloudCanvas.disableWordcloud();
});
