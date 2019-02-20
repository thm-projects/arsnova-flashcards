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
	'click .toggleImpressumNavigation': function (event) {
		event.preventDefault();
		let thmNavCollapse = $('#thm-top-navigation');
		let contactNavCollapse = $('#contact-nav-collapse');
		if (thmNavCollapse.hasClass('in')) {
			thmNavCollapse.collapse('hide');
			thmNavCollapse.one('hidden.bs.collapse', function () {
				contactNavCollapse.collapse('show');
			});
		} else {
			contactNavCollapse.collapse('toggle');
		}
	},
	'click .toggle-thm-collapse': function (event) {
		event.preventDefault();
		let thmNavCollapse = $('#thm-top-navigation');
		let contactNavCollapse = $('#contact-nav-collapse');
		if (contactNavCollapse.hasClass('in')) {
			contactNavCollapse.collapse('hide');
			contactNavCollapse.one('hidden.bs.collapse', function () {
				thmNavCollapse.collapse('show');
			});
		} else {
			thmNavCollapse.collapse('toggle');
		}
	},
	'click #thm-top-navigation a:not(#dropdownMenuLink)': function () {
		$('#thm-top-navigation').collapse('hide');
	}
});
