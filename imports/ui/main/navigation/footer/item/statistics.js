import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {MainNavigation} from "../../../../../util/mainNavigation.js";
import "./statistics.html";

/*
 * ############################################################################
 * mainNavigationFooterItemStatistics
 * ############################################################################
 */

Template.mainNavigationFooterItemStatistics.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});


Template.mainNavigationFooterItemStatistics.helpers({
	serverStatisticsModalActive: function () {
		return Session.get('serverStatisticsModalActive');
	}
});

Template.mainNavigationFooterItemStatistics.events({
	"click .showStatistics": function () {
		$('#impressumStatisticsModal').modal('show');
		MainNavigation.closeCollapse();
	}
});

/*
 * ############################################################################
 * mainNavigationFooterItemStatisticsMobile
 * ############################################################################
 */

Template.mainNavigationFooterItemStatisticsMobile.onRendered(function () {
	MainNavigation.repositionCollapseElements();
});

Template.mainNavigationFooterItemStatisticsMobile.helpers({
	serverStatisticsModalActive: function () {
		return Session.get('serverStatisticsModalActive');
	}
});

Template.mainNavigationFooterItemStatisticsMobile.events({
	"click .showStatistics": function () {
		$('#impressumStatisticsModal').modal('show');
		MainNavigation.closeCollapse();
	}
});
