import "./learning.html";
import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";

Template.mainNavigationFooterItemLearning.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
