import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";

export const LeitnerActivationDay = new Mongo.Collection("leitnerActivationDay");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetActivationDay", function (cardset_id) {
		if (Meteor.userId()) {
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined) {
				return LeitnerActivationDay.find({
					learning_phase_id: leitnerLearningWorkload.learning_phase_id,
					workload_id: leitnerLearningWorkload._id,
					cardset_id: cardset_id,
					user_id: Meteor.userId()
				}, {sort: {createdAt: -1}, limit: 1});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
}

const LeitnerActivationDaySchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	user_id: {
		type: String
	},
	learning_phase_id: {
		type: String
	},
	workload_id: {
		type: String
	},
	resetDeadlineMode: {
		type: Number
	},
	wrongAnswerMode: {
		type: Number
	},
	notifications: {
		type: Object,
		blackbox: true
	},
	strictWorkloadTimer: {
		type: Boolean
	},
	timer: {
		type: Object,
		blackbox: true
	},
	performanceStats: {
		type: Object,
		blackbox: true
	},
	createdAt: {
		type: Date
	},
	missedDeadline: {
		type: Boolean
	}
});

LeitnerActivationDay.attachSchema(LeitnerActivationDaySchema);
