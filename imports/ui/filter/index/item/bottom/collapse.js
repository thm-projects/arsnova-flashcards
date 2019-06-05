import "./collapse.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * filterIndexItemBottomCollapse
 * ############################################################################
 */

Template.filterIndexItemBottomCollapse.events({
	'click .collapseCardsetInfoButton': function (event) {
		if ($(event.target).hasClass('glyphicon-collapse-up')) {
			$(event.target).addClass('glyphicon-collapse-down').removeClass('glyphicon-collapse-up');
			$($(event.target).data('id')).hide('slide', {direction: "up"}, 'slow');
		} else {
			$("[id^=collapseCardsetInfo]").hide('slide', {direction: "up"}, 'fast');
			$(".collapseCardsetInfoIcon").addClass('glyphicon-collapse-down').removeClass('glyphicon-collapse-up');
			$(event.target).addClass('glyphicon-collapse-up').removeClass('glyphicon-collapse-down');
			$($(event.target).data('id')).show('slide', {direction: "up"}, 'slow', function () {
				$('body, html').animate({scrollTop: ($(event.target).offset().top - ($('.resultItemHeaderWrapper').height() + $('.thm-header').height() - 25))}, 'slow');
			});
		}
	}
});
