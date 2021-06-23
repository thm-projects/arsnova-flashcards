import {Mongo} from "meteor/mongo";
import {LeitnerActivationDay} from "./leitnerActivationDay";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";

export const LeitnerPerformanceHistory = new Mongo.Collection("leitnerPerformanceHistory");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetPerformanceHistory", function (cardset_id) {
		if (Meteor.userId()) {
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined) {
				let activation_day = LeitnerActivationDay.findOne({
						learning_phase_id: leitnerLearningWorkload.learning_phase_id,
						workload_id: leitnerLearningWorkload._id,
						cardset_id: cardset_id,
						user_id: Meteor.userId()
					}, {sort: {createdAt: -1}, fields: {_id: 1}});
				if (activation_day !== undefined) {
					return LeitnerPerformanceHistory.find({
						learning_phase_id: leitnerLearningWorkload.learning_phase_id,
						workload_id: leitnerLearningWorkload._id,
						activation_day_id: activation_day._id,
						cardset_id: cardset_id,
						user_id: Meteor.userId()
					});
				} else {
					this.ready();
				}
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
}

const LeitnerPerformanceHistorySchema = new SimpleSchema({
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
	user_id: {
		type: String
	},
	activation_day_id: {
		type: String
	},
	learning_phase_id: {
		type: String
	},
	workload_id: {
		type: String
	},
	box: {
		type: Number
	},
	skipped: {
		type: Number,
		defaultValue: 0
	},
	answer: {
		type: Number,
		optional: true
	},
	missedDeadline: {
		type: Boolean,
		defaultValue: false
	},
	timestamps: {
		type: Object,
		optional: true,
		blackbox: true
	},
	mcAnswers: {
		type: Object,
		optional: true
	},
	"mcAnswers.user": {
		type: [Number]
	},
	"mcAnswers.card": {
		type: [Number]
	}
});

LeitnerPerformanceHistory.attachSchema(LeitnerPerformanceHistorySchema);
