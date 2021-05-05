import "./workload.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {LeitnerUserCardStats} from "../../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {Wozniak} from "../../../../../api/subscriptions/wozniak";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {LeitnerLearningWorkloadUtilities} from "../../../../../util/learningWorkload";

function getLeitnerCount(cardset) {
	let learningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset._id, Meteor.userId());
	if (learningWorkload !== undefined) {
		return LeitnerUserCardStats.find({
			learning_phase_id: learningWorkload.learning_phase_id,
			workload_id: learningWorkload._id,
			cardset_id: cardset._id,
			user_id: Meteor.userId(),
			isActive: true
		}).count();
	} else {
		return 0;
	}
}

function getWozniakCount(cardset) {
	let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	actualDate.setHours(0, 0, 0, 0);
	return Wozniak.find({
		cardset_id: cardset._id, user_id: Meteor.userId(), nextDate: {
			$lte: actualDate
		}
	}).count();
}

/*
 * ############################################################################
 * filterIndexItemTopWorkload
 * ############################################################################
 */

Template.filterIndexItemTopWorkload.events({
	"click .learnLeitner": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		FlowRouter.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnWozniak": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		FlowRouter.go('memo', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnSelect": function (event) {
		Session.set("activeCardset", Cardsets.findOne($(event.target).data('id')));
	}
});

Template.filterIndexItemTopWorkload.helpers({
	getWorkloadType: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		if (leitner !== 0 && wozniak === 0) {
			return "learnLeitner";
		} else if (leitner === 0 && wozniak !== 0) {
			return "learnWozniak";
		} else if (leitner !== 0 && wozniak !== 0) {
			return "learnSelect";
		} else {
			return "";
		}
	},
	gotWorkloadForBothTypes: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		return leitner !== 0 && wozniak !== 0;
	},
	gotWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		return count !== 0;
	},
	getWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		if (count === 1) {
			return count + TAPi18n.__('set-list.cardsToLearn');
		} else {
			return count + TAPi18n.__('set-list.cardsToLearnPlural');
		}
	}
});
