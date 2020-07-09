import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./agb.html";

Template.mainNavigationFooterItemAGB.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
