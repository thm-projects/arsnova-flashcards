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
		return Filter.getFilterQuery().owner !== undefined;
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
