import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Filter} from "../../../../util/filter";
import {MainNavigation} from "../../../../util/mainNavigation";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./item/all/all.js";
import "./item/backend.js";
import "./item/connectionStatus.js";
import "./item/displayModeButton.js";
import "./item/help.js";
import "./item/logout.js";
import "./item/personal/personal.js";
import "./item/public/public.js";
import "./item/profile/profile.js";
import "./item/transcripts/transcripts.js";
import "./item/search.js";
import "./item/useCases.js";
import "./item/workload.js";
import "./item/filter.js";
import "./item/presentationIndex/presentationIndex.js";
import "./top.html";
import "./item/notification/frontendNotification.js";

/*
 * ############################################################################
 * mainNavigationTop
 * ############################################################################
 */

Template.mainNavigationTop.events({
	'click .logout': function (event) {
		event.preventDefault();
		Session.set('helpFilter', undefined);
		MainNavigation.setLoginTarget(false);
		Session.set('firedUseCaseModal', false);
		MainNavigation.setGuestLogin("false");
		Filter.resetFilters();
		if (Meteor.user()) {
			Meteor.logout(function () {
				FlowRouter.go('home');
			});
		} else {
			FlowRouter.go('home');
		}
	},
	'click .toggleFooterNavigation': function (event) {
		event.preventDefault();
		let navbarTopCollapse = $('#navbar-cards-top-collapse');
		let navbarFooterCollapse = $('#navbar-cards-footer-collapse');
		if (navbarTopCollapse.hasClass('in')) {
			navbarTopCollapse.collapse('hide');
			navbarTopCollapse.one('hidden.bs.collapse', function () {
				navbarFooterCollapse.collapse('show');
			});
		} else {
			navbarFooterCollapse.collapse('toggle');
		}
	},
	'click .toggle-navbar-collapse': function (event) {
		event.preventDefault();
		let navbarTopCollapse = $('#navbar-cards-top-collapse');
		let navbarFooterCollapse = $('#navbar-cards-footer-collapse');
		if (navbarFooterCollapse.hasClass('in')) {
			navbarFooterCollapse.collapse('hide');
			navbarFooterCollapse.one('hidden.bs.collapse', function () {
				navbarTopCollapse.collapse('show');
			});
		} else {
			navbarTopCollapse.collapse('toggle');
		}
	},
	'click #navbar-cards-top-collapse a:not(.dropdownMenuContainer)': function () {
		MainNavigation.closeCollapse();
	}
});
