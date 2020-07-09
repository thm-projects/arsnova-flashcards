import "./learning.html";
import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";

Template.mainNavigationFooterItemLearning.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
