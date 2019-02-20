import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "../../../../api/mainNavigation";
import "./item/allCardsets.js";
import "./item/backend.js";
import "./item/connectionStatus.js";
import "./item/help.js";
import "./item/logout.js";
import "./item/myCardsets.js";
import "./item/pool.js";
import "./item/profile/profile.js";
import "./item/repetitorium.js";
import "./item/search.js";
import "./item/workload.js";
import "./top.html";

Template.mainNavigationTop.events({
	'click .logout': function (event) {
		event.preventDefault();
		Session.set('helpFilter', undefined);
		MainNavigation.setLoginTarget(false);
		Meteor.logout();
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
	'click #navbar-cards-top-collapse a:not(#dropdownMenuLink)': function () {
		$('#navbar-cards-top-collapse').collapse('hide');
	}
});
