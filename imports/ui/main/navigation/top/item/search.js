import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Search} from "../../../../../api/search.js";
import {MainNavigation} from "../../../../../api/mainNavigation.js";
import "./search.html";

/*
* ############################################################################
* mainNavigationTopItemSearchInput
* ############################################################################
*/

Template.mainNavigationTopItemSearchInput.events({
	'keyup .input-search': function (event) {
		event.preventDefault();
		Session.set("searchValue", $(event.currentTarget).val());
		Meteor.call('getSearchCategoriesResult', Session.get("searchValue"), function (error, result) {
			if (result) {
				Session.set('searchCategoriesResult', result);
			}
		});
		if ($(event.currentTarget).val() && Session.get('searchCategoriesResult') !== undefined) {
			$('.searchDropdown').addClass("open");
		} else {
			$('.searchDropdown').removeClass("open");
		}
		Search.adjustSearchResultWindowSize();
	},
	'click .input-search': function () {
		Search.adjustSearchResultWindowSize();
		MainNavigation.closeCollapse();
	},
	'click .clearSearch i': function () {
		MainNavigation.clearSearch();
		$('.input-search:visible').focus();
	}
});

Template.mainNavigationTopItemSearchInput.helpers({
	searchActive: function () {
		return Session.get("searchValue") !== "" && Session.get("searchValue") !== undefined;
	},
	getPlaceholder: function () {
		if (this.longPlaceholder) {
			return TAPi18n.__('navbar-collapse.search');
		} else {
			return TAPi18n.__('navbar-collapse.searchMobile');
		}
	}
});

Template.mainNavigationTopItemSearchInput.onRendered(function () {
	Session.set("searchValue", undefined);
	Search.adjustSearchResultWindowSize();
	$(window).resize(function () {
		Search.adjustSearchResultWindowSize();
	});
});


/*
* ############################################################################
* mainNavigationTopItemSearchDropdown
* ############################################################################
*/

Template.mainNavigationTopItemSearchDropdown.events({
	'click #toggle-search-dropdown': function () {
		if ($('#navbar-cards-search-dropdown').hasClass('active')) {
			MainNavigation.clearSearch();
			$('#navbar-cards-search-dropdown').removeClass('active');
		} else {
			$('#navbar-cards-search-dropdown').addClass('active');
			$('.input-search:visible').focus();
		}
	}
});
