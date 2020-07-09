import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../api/mainNavigation";
import "./impressum.html";

Template.mainNavigationFooterItemImpressum.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
