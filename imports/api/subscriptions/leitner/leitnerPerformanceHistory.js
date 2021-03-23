import {Mongo} from "meteor/mongo";
import {LeitnerActivationDay} from "./leitnerActivationDay";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const LeitnerPerformanceHistory = new Mongo.Collection("leitnerPerformanceHistory");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetHistory", function (cardset_id) {
		if (Meteor.userId()) {
			let task = LeitnerActivationDay.findOne({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, fields: {_id: 1}});
			if (task !== undefined) {
				return LeitnerPerformanceHistory.find({cardset_id: cardset_id, user_id: Meteor.userId(), task_id: task._id});
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
	}
});

LeitnerPerformanceHistory.attachSchema(LeitnerPerformanceHistorySchema);
