import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const LeitnerActivationDay = new Mongo.Collection("leitnerActivationDay");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetTask", function (cardset_id) {
		if (Meteor.userId()) {
			return LeitnerActivationDay.find({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, limit: 1});
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
