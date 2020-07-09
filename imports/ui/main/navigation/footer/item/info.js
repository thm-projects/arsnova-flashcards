import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./info.html";

Template.mainNavigationFooterItemInfo.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
