import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const LeitnerLearningWorkload = new Mongo.Collection("leitnerLearningWorkload");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetWorkload", function (cardset_id) {
		if (Meteor.userId()) {
			return LeitnerLearningWorkload.find({
				cardset_id: cardset_id,
				user_id: Meteor.userId(),
				isActive: true
			});
		} else {
			this.ready();
		}
	});
	Meteor.publish("userWorkload", function () {
		if (Meteor.userId()) {
			return LeitnerLearningWorkload.find({
				user_id: Meteor.userId(),
				isActive: true
			});
		} else {
			this.ready();
		}
	});
	Meteor.publish("allUserWorkload", function () {
		if (Meteor.userId()) {
			return LeitnerLearningWorkload.find({
				user_id: Meteor.userId()
			});
		} else {
			this.ready();
		}
	});
}

const LeitnerLearningWorkloadSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	user_id: {
		type: String
	},
	learning_phase_id: {
		type: String
	},
	isBonus: {
		type: Boolean,
		defaultValue: false
	},
	isActive: {
		type: Boolean,
		defaultValue: true
	},
	createdAt: {
		type: Date,
		defaultValue: new Date()
	},
	updatedAt: {
		type: Date,
		defaultValue: new Date()
	},
	activeCardCount: {
		type: Number,
		defaultValue: 0
	},
	activationDate: {
		type: Date,
		defaultValue: new Date()
	},
	nextActivationDate: {
		type: Date,
		defaultValue: new Date()
	},
	nextLowestPriority: {
		type: [Number],
		optional: true
	},
	gotFinished: {
		type: Boolean,
		defaultValue: false
	},
	'performanceStats.answerTime': {
		type: Object
	},
	'performanceStats.answerTime.median': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.answerTime.arithmeticMean': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.answerTime.standardDeviation': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.workingTime': {
		type: Object
	},
	'performanceStats.workingTime.sum': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.workingTime.median': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.workingTime.arithmeticMean': {
		type: Number,
		defaultValue: 0
	},
	'performanceStats.workingTime.standardDeviation': {
		type: Number,
		defaultValue: 0
	}
});

LeitnerLearningWorkload.attachSchema(LeitnerLearningWorkloadSchema);
