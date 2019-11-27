import "./statistics.html";
import "./item/cardset.js";
import "./item/info.js";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";
import {Template} from "meteor/templating";
import {Filter} from "../../../../../api/filter";
import {FilterNavigation} from "../../../../../api/filterNavigation";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {Session} from "meteor/session";
import {Route} from "../../../../../api/route";

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
	transcriptBonus: function () {
		if (Route.isTranscriptBonus()) {
			let transcriptBonusUsers = _.uniq(TranscriptBonus.find({cardset_id: Router.current().params._id}, {
				fields: {user_id: 1}
			}).fetch().map(function (x) {
				return x.user_id;
			}), true);
			let users = Meteor.users.find({_id: {$in: transcriptBonusUsers}}, {sort: {"profile.birthname": 1}, fields: {_id: 1}}).fetch();
			let list = [];
			for (let i = 0; i < users.length; i++) {
				list.push({user_id: users[i]._id, cardset_id: Router.current().params._id});
			}
			return list;
		} else {
			let transcriptBonusCardsets = _.uniq(TranscriptBonus.find({user_id: Meteor.userId()}, {
				fields: {cardset_id: 1}
			}).fetch().map(function (x) {
				return x.cardset_id;
			}), true);
			let cardsets = Cardsets.find({_id: {$in: transcriptBonusCardsets}}, {sort: {"name": 1}, fields: {_id: 1}}).fetch();
			let list = [];
			for (let i = 0; i < cardsets.length; i++) {
				list.push({user_id: Meteor.userId(), cardset_id: cardsets[i]._id});
			}
			return list;
		}
	}
});
