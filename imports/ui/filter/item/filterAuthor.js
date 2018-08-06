import "./filterAuthor.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Filter} from "../../../api/filter";
import {Cardsets} from "../../../api/cardsets";
import {getAuthorName} from "../../../api/userdata";

/*
 * ############################################################################
 * filterItemFilterAuthors
 * ############################################################################
 */

Template.filterItemFilterAuthors.helpers({
	hasAuthorFilter: function () {
		return Filter.getFilterQuery().owner !== undefined;
	},
	getAuthors: function () {
		return Meteor.users.find({}, {fields: {_id: 1, profile: 1}, sort: {"profile.birthname": 1}}).fetch();
	},
	filterAuthors: function (id) {
		let query = Filter.getFilterQuery();
		query.owner = id;
		return Cardsets.findOne(query);
	},
	getAuthorName: function () {
		return getAuthorName(this._id);
	},
	resultsFilterAuthor: function (id) {
		return Filter.getFilterQuery().owner === id;
	}
});

Template.filterItemFilterAuthors.events({
	'click .noFilterAuthor': function () {
		Filter.setActiveFilter(undefined, "author");
	},
	'click .filterAuthor': function (event) {
		Filter.setActiveFilter($(event.target).data('id'), "author");
	}
});
