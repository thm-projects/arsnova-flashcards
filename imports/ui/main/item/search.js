import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {CardVisuals as Search} from "../../../api/search";
import "./search.html";

/*
* ############################################################################
* mainNavigationItemSearch
* ############################################################################
*/

Template.mainNavigationItemSearch.events({
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
	}
});

Template.mainNavigationItemSearch.helpers({
	searchActive: function () {
		return Session.get("searchValue") !== "" && Session.get("searchValue") !== undefined;
	}
});

Template.mainNavigationItemSearch.onRendered(function () {
	Session.set("searchValue", undefined);
	Search.adjustSearchResultWindowSize();
	$(window).resize(function () {
		Search.adjustSearchResultWindowSize();
	});
});

/*
* ############################################################################
* mainNavigationItemSearchResult
* ############################################################################
*/

Template.mainNavigationItemSearchResult.helpers({
	searchCategories: function () {
		return Session.get('searchCategoriesResult');
	}
});
