import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./about.html";

Template.mainNavigationFooterItemAbout.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
