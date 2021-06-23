import "./filterAuthor.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Filter} from "../../../../util/filter";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {getAuthorName} from "../../../../util/userData";
import {Route} from "../../../../util/route";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {DELETED_USER_ID} from '../../../../config/userData';

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
		let userFilter = [];
		if (Route.isTranscriptBonus()) {
			userFilter = _.uniq(TranscriptBonus.find({cardset_id: FlowRouter.getParam('_id')}, {fields: {user_id: 1}}).fetch().map(function (x) {
				return x.user_id;
			}), true);
		} else {
			let query = Filter.getFilterQuery();
			delete query.owner;
			userFilter = _.uniq(Cardsets.find(query, {fields: {owner: 1}}).fetch().map(function (x) {
				return x.owner;
			}), true);
		}
		let result = Meteor.users.find({_id: {$in: userFilter}}, {fields: {_id: 1, profile: 1}, sort: {"profile.birthname": 1, "profile.name": 1}}).fetch();
		if (userFilter.includes(DELETED_USER_ID)) {
			result.push({
				_id: DELETED_USER_ID
			});
		}
		return result;
	},
	getAuthorName: function (profile) {
		return getAuthorName(profile._id, true, false,false, profile);
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
