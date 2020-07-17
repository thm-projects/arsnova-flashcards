import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./faq.html";

Template.mainNavigationFooterItemFAQ.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
