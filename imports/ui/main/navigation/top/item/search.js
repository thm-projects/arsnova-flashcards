import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Search} from "../../../../../api/search.js";
import "./search.html";

/*
* ############################################################################
* mainNavigationTopItemSearch
* ############################################################################
*/

Template.mainNavigationTopItemSearch.events({
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

Template.mainNavigationTopItemSearch.helpers({
	searchActive: function () {
		return Session.get("searchValue") !== "" && Session.get("searchValue") !== undefined;
	},
	getVisibility: function () {
		if (this.visibility === 0) {
			return "visible-xs";
		} else {
			return "hidden-xs";
		}
	}
});

Template.mainNavigationTopItemSearch.onRendered(function () {
	Session.set("searchValue", undefined);
	Search.adjustSearchResultWindowSize();
	$(window).resize(function () {
		Search.adjustSearchResultWindowSize();
	});
});
