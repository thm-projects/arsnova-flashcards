import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./datenschutz.html";

Template.mainNavigationFooterItemDatenschutz.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
