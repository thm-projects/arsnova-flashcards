import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {AspectRatio} from "../../../api/aspectRatio";
import {CardNavigation} from "../../../api/cardNavigation";
import {Icons} from "../../../api/icons";

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
