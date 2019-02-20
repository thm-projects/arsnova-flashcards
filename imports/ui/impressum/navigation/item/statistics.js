import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./statistics.html";

/*
 * ############################################################################
 * impressumNavigationItemStatistics
 * ############################################################################
 */

Template.impressumNavigationItemStatistics.helpers({
	serverStatisticsModalActive: function () {
		return Session.get('serverStatisticsModalActive');
	}
});

Template.impressumNavigationItemStatistics.events({
	"click .showStatistics": function () {
		$('#impressumStatisticsModal').modal('show');
	}
});

/*
 * ############################################################################
 * impressumNavigationItemStatisticsMobile
 * ############################################################################
 */

Template.impressumNavigationItemStatisticsMobile.helpers({
	serverStatisticsModalActive: function () {
		return Session.get('serverStatisticsModalActive');
	}
});

Template.impressumNavigationItemStatisticsMobile.events({
	"click .showStatistics": function () {
		$('#impressumStatisticsModal').modal('show');
	}
});
