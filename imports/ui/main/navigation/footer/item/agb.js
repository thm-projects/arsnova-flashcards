import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./agb.html";

Template.mainNavigationFooterItemAGB.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
