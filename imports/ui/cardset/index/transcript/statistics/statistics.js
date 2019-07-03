import "./statistics.html";
import "./item/cardset.js";
import "./item/user.js";
import {TranscriptBonus, TranscriptBonusList} from "../../../../../api/transcriptBonus";
import {Template} from "meteor/templating";
import {Filter} from "../../../../../api/filter";
import {FilterNavigation} from "../../../../../api/filterNavigation";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetTranscriptStatistics
 * ############################################################################
 */


Template.cardsetIndexTranscriptStatistics.events({
	'click .filterTranscriptSubmissions': function (event) {
		Session.set('transcriptViewingMode', 2);
		Filter.setActiveFilter($(event.target).data('id'), "author", 30);
		FilterNavigation.showDropdown();
	},
	'click .filterSubmissionsRating': function (event) {
		Session.set('transcriptViewingMode', 2);
		Filter.setActiveFilter($(event.target).data('id'), "author", 30);
		Filter.setActiveFilter($(event.target).data('rating'), "rating", 30);
		FilterNavigation.showDropdown();
	}
});

Template.cardsetIndexTranscriptStatistics.helpers({
	transcriptBonusUser: function () {
		let transcriptBonusUsers = _.uniq(TranscriptBonus.find({cardset_id: Router.current().params._id}, {
			fields: {user_id: 1}
		}).fetch().map(function (x) {
			return x.user_id;
		}), true);
		return Meteor.users.find({_id: {$in: transcriptBonusUsers}}, {sort: {"profile.birthname": 1}, fields: {_id: 1}}).fetch();
	},
	getSubmissions: function (id, rating = undefined) {
		let query = {cardset_id: Router.current().params._id, user_id: id};
		if (rating !== undefined) {
			query.rating = rating;
		}
		return TranscriptBonus.find(query).count();
	},
	lastSubmission: function (id) {
		let bonusTranscript = TranscriptBonus.findOne({user_id: id}, {sort: {date: -1}});
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getLectureName(bonusTranscript, false);
		}
	},
	getBonusTranscriptRating: function (type) {
		return TranscriptBonusList.getBonusTranscriptRating(type);
	}
});
