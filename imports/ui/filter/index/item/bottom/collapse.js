import "./collapse.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * filterIndexItemBottomCollapse
 * ############################################################################
 */

Template.filterIndexItemBottomCollapse.events({
	'click .collapseCardsetInfoButton': function (event) {
		if ($(event.target).hasClass('fa-caret-square-up')) {
			$(event.target).addClass('fa-caret-square-down').removeClass('fa-caret-square-up');
			$($(event.target).data('id')).hide('slide', {direction: "up"}, 'slow');
		} else {
			$("[id^=collapseCardsetInfo]").hide('slide', {direction: "up"}, 'fast');
			$(".collapseCardsetInfoIcon").addClass('fa-caret-square-down').removeClass('fa-caret-square-up');
			$(event.target).addClass('fa-caret-square-up').removeClass('fa-caret-square-down');
			$($(event.target).data('id')).show('slide', {direction: "up"}, 'slow', function () {
				$('body, html').animate({scrollTop: ($(event.target).offset().top - ($('.resultItemHeaderWrapper').height() + $('.thm-header').height() - 25))}, 'slow');
			});
		}
	}
});
