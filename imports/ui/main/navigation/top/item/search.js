import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Search} from "../../../../../api/search.js";
import {MainNavigation} from "../../../../../api/mainNavigation.js";
import {Route} from "../../../../../api/route";
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
		let filterType = 0;
		if (Route.isPool())  {
			filterType = 1;
		} else if (Route.isRepetitorium()) {
			filterType = 2;
		}
		Meteor.call('getSearchCategoriesResult', Session.get("searchValue"), filterType, function (error, result) {
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
			if (Route.isPool()) {
				return TAPi18n.__('navbar-collapse.search.cardset');
			} else if (Route.isRepetitorium()) {
				return TAPi18n.__('navbar-collapse.search.repetitorium');
			} else {
				return TAPi18n.__('navbar-collapse.search.all');
			}
		} else {
			return TAPi18n.__('navbar-collapse.search.mobile');
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
