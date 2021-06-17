import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as config from "../../../config/bonusForm";
import {ServerStyle} from "../../../util/styles";
import {UserPermissions} from "../../../util/permissions";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";

export const LeitnerLearningPhase = new Mongo.Collection("leitnerLearningPhase");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetLearningPhase", function (cardset_id) {
		if ((Meteor.userId() || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined) {
				return LeitnerLearningPhase.find({
					_id: leitnerLearningWorkload.learning_phase_id,
					isActive: true
				});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("learningPhaseActiveCardsetBonus", function (cardset_id) {
		if ((Meteor.userId() || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			return LeitnerLearningPhase.find({cardset_id: cardset_id, isActive: true, isBonus: true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("learningPhaseActiveBonus", function () {
		if ((Meteor.userId() || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			return LeitnerLearningPhase.find({isActive: true, isBonus: true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("learningPhaseBonus", function () {
		if ((Meteor.userId() || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			return LeitnerLearningPhase.find({isBonus: true});
		} else {
			this.ready();
		}
	});
}

const LeitnerLearningPhaseSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	title: {
		type: String,
		optional: true
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
	lastEditor: {
		type: String,
		optional: true
	},
	daysBeforeReset: {
		type: Number,
		defaultValue: config.defaultDaysBeforeReset
	},
	start: {
		type: Date,
		optional: true
	},
	end: {
		type: Date,
		optional: true
	},
	intervals: {
		type: [Number],
		defaultValue: config.defaultIntervals
	},
	registrationPeriod: {
		type: Date,
		optional: true
	},
	maxCards: {
		type: Number,
		defaultValue: config.defaultMaxWorkload
	},
	pomodoroTimer: {
		type: Object,
		optional: true,
		blackbox: true
	},
	bonusPoints: {
		type: Object,
		optional: true
	},
	'bonusPoints.minLearned': {
		type: Number,
		defaultValue: config.defaultMinLearned
	},
	'bonusPoints.maxPoints': {
		type: Number,
		defaultValue: config.defaultMaxBonusPoints
	},
	strictWorkloadTimer: {
		type: Boolean,
		defaultValue: true
	},
	'forceNotifications.mail': {
		type: Boolean,
		defaultValue: config.defaultForceNotifications.mail
	},
	'forceNotifications.push': {
		type: Boolean,
		defaultValue: config.defaultForceNotifications.push
	},
	'performanceStats.answerTime': {
		type: Object,
		optional: true
	},
	'performanceStats.answerTime.median': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.arithmeticMean': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.standardDeviation': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime': {
		type: Object,
		optional: true
	},
	'performanceStats.workingTime.sum': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.median': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.arithmeticMean': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.standardDeviation': {
		type: Number,
		optional: true
	},
	'simulator': {
		type: Object,
		optional: true
	},
	'simulator.errorCount': {
		type: [Number],
		defaultValue: config.defaultErrorCount
	}
});

LeitnerLearningPhase.attachSchema(LeitnerLearningPhaseSchema);
