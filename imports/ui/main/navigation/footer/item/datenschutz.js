import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./datenschutz.html";

Template.mainNavigationFooterItemDatenschutz.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
