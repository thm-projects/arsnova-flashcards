import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./faq.html";

Template.mainNavigationFooterItemFAQ.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
