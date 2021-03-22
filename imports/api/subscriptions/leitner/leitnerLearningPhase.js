import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as config from "../../../config/bonusForm";

export const LeitnerLearningPhase = new Mongo.Collection("leitnerLearningPhase");

const LeitnerLearningPhaseSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	name: {
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
		type: Object,
		optional: true
	},
	'performanceStats.answerTime.median.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.median.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.arithmeticMean': {
		type: Object,
		optional: true
	},
	'performanceStats.answerTime.arithmeticMean.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.arithmeticMean.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.standardDeviation': {
		type: Object,
		optional: true
	},
	'performanceStats.answerTime.standardDeviation.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.answerTime.standardDeviation.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.sum.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.sum.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.median.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.median.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.arithmeticMean.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.arithmeticMean.normal': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.standardDeviation.bonus': {
		type: Number,
		optional: true
	},
	'performanceStats.workingTime.standardDeviation.normal': {
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
