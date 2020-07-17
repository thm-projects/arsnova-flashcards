import {Template} from "meteor/templating";
import {MainNavigation} from "../../../../../util/mainNavigation";
import "./impressum.html";

Template.mainNavigationFooterItemImpressum.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});
