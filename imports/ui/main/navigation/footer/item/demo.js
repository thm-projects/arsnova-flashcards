import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./demo.html";

Template.mainNavigationFooterItemDemo.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
