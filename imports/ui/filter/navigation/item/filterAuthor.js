import "./filterAuthor.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Filter} from "../../../../api/filter";
import {Cardsets} from "../../../../api/cardsets";
import {getAuthorName} from "../../../../api/userdata";
import {Route} from "../../../../api/route";
import {TranscriptBonus} from "../../../../api/transcriptBonus";

/*
 * ############################################################################
 * filterItemFilterAuthors
 * ############################################################################
 */

Template.filterItemFilterAuthors.helpers({
	hasAuthorFilter: function () {
		if (Route.isTranscriptBonus()) {
			return Filter.getActiveFilter().user_id !== undefined;
		} else {
			return Filter.getFilterQuery().owner !== undefined;
		}
	},
	getAuthors: function () {
		let query = {};
		if (Route.isTranscriptBonus()) {
			let bonusTranscripts = TranscriptBonus.find({cardset_id: Router.current().params._id}).fetch();
			let userFilter = [];
			for (let i = 0; i < bonusTranscripts.length; i++) {
				userFilter.push(bonusTranscripts[i].user_id);
			}
			query._id = {$in: userFilter};
		}
		return Meteor.users.find(query, {fields: {_id: 1, profile: 1}, sort: {"profile.birthname": 1}}).fetch();
	},
	filterAuthors: function (id) {
		if (Route.isTranscriptBonus()) {
			return true;
		} else {
			let query = Filter.getFilterQuery();
			query.owner = id;
			return Cardsets.findOne(query);
		}
	},
	getAuthorName: function () {
		return getAuthorName(this._id);
	},
	resultsFilterAuthor: function (id) {
		if (Route.isTranscriptBonus()) {
			return Filter.getActiveFilter().user_id === id;
		} else {
			return Filter.getFilterQuery().owner === id;
		}
	}
});

Template.filterItemFilterAuthors.events({
	'click .noFilterAuthor': function () {
		if (Route.isTranscriptBonus()) {
			Filter.setActiveFilter(undefined, "user_id");
		} else {
			Filter.setActiveFilter(undefined, "author");
		}
	},
	'click .filterAuthor': function (event) {
		if (Route.isTranscriptBonus()) {
			Filter.setActiveFilter($(event.target).data('id'), "user_id");
		} else {
			Filter.setActiveFilter($(event.target).data('id'), "author");
		}
	}
});
