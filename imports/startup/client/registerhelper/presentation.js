import {Session} from "meteor/session";
import {CardVisuals} from "../../../util/cardVisuals";
import {AspectRatio} from "../../../util/aspectRatio";
import {CardNavigation} from "../../../util/cardNavigation";
import {Icons} from "../../../util/icons";

Template.registerHelper("isSidebarHidden", function () {
	return Session.get('hideSidebar');
});

Template.registerHelper("fullscreenActive", function () {
	return Session.get('fullscreen');
});

Template.registerHelper("is3DActive", function () {
	return Session.get('is3DActive');
});

Template.registerHelper("got3DMode", function () {
	return CardVisuals.got3DMode();
});

Template.registerHelper('gotAspectRatio', function () {
	return AspectRatio.isEnabled();
});

Template.registerHelper('isFixedSidebar', function () {
	return CardVisuals.isFixedSidebar();
});

Template.registerHelper('isMobileView', function () {
	return CardNavigation.isMobileView();
});

Template.registerHelper("getDisplayModeIcons", function (type) {
	return Icons.displayMode(type);
});
