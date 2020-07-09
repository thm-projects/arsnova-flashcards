import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./demo.html";

Template.mainNavigationFooterItemDemo.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
