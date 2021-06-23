import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";
import {LeitnerLearningWorkload} from "./leitnerLearningWorkload";

export const LeitnerBonusCardStats = new Mongo.Collection("leitnerBonusCardStats");
export const LeitnerUserCardStats = new Mongo.Collection("leitnerUserCardStats");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetCards", function (cardset_id) {
		if (Meteor.userId()) {
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined) {
				return LeitnerUserCardStats.find({
					learning_phase_id: leitnerLearningWorkload.learning_phase_id,
					workload_id: leitnerLearningWorkload._id,
					cardset_id: cardset_id,
					user_id: Meteor.userId()
				});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userCardsetLeitner", function (cardset_id, user_id) {
		if (Meteor.userId()) {
			if (Meteor.userId() === user_id || Roles.userIsInRole(Meteor.userId(), [
				'admin',
				'editor',
				'lecturer'
			])) {
				return LeitnerUserCardStats.find({cardset_id: cardset_id, user_id: user_id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userLeitner", function () {
		if (Meteor.userId()) {
			let leitnerWorkloadIDs = LeitnerLearningWorkload.find({
				user_id: Meteor.userId(),
				isActive: true
			}).fetch().map(workload => workload._id);
			return LeitnerUserCardStats.find({
				user_id: Meteor.userId(),
				workload_id: {$in: leitnerWorkloadIDs}
			});
		} else {
			this.ready();
		}
	});
	Meteor.publish("allLeitner", function () {
		if (Meteor.userId()) {
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
				return LeitnerUserCardStats.find();
			}
		} else {
			this.ready();
		}
	});
}

const LeitnerUserCardStatsSchema = new SimpleSchema({
	card_id: {
		type: String
	},
	cardset_id: {
		type: String
	},
	original_cardset_id: {
		type: String,
		optional: true
	},
	workload_id: {
		type: String
	},
	user_id: {
		type: String
	},
	learning_phase_id: {
		type: String
	},
	box: {
		type: Number,
		defaultValue: 1
	},
	isActive: {
		type: Boolean,
		defaultValue: false
	},
	submittedAnswer: {
		type: Boolean,
		defaultValue: false
	},
	nextPossibleActivationDate: {
		type: Date,
		defaultValue: new Date()
	},
	activatedSinceDate: {
		type: Date,
		defaultValue: new Date()
	},
	priority: {
		type: Number,
		defaultValue: 0
	},
	viewedPDF: {
		type: Boolean,
		defaultValue: false
	},
	stats: {
		type: Object
	},
	'stats.answers': {
		type: Object
	},
	'stats.answers.known': {
		type: Number,
		defaultValue: 0
	},
	'stats.answers.notKnown': {
		type: Number,
		defaultValue: 0
	},
	'stats.answers.skipped': {
		type: Number,
		defaultValue: 0
	},
	'stats.workingTime': {
		type: Object
	},
	'stats.workingTime.sum': {
		type: Number,
		defaultValue: 0
	},
	'stats.workingTime.median': {
		type: Number,
		defaultValue: 0
	},
	'stats.workingTime.arithmeticMean': {
		type: Number,
		defaultValue: 0
	},
	'stats.workingTime.standardDeviation': {
		type: Number,
		defaultValue: 0
	}
});

LeitnerUserCardStats.attachSchema(LeitnerUserCardStatsSchema);
