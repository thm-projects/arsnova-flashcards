import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./info.html";

Template.mainNavigationFooterItemInfo.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
