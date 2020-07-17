import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./help.html";

Template.mainNavigationFooterItemHelp.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
