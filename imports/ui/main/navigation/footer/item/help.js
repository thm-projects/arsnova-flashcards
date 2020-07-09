import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./help.html";

Template.mainNavigationFooterItemHelp.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
