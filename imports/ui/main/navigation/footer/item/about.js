import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./about.html";

Template.mainNavigationFooterItemAbout.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
