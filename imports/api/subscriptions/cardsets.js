import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../util/styles";
import {UserPermissions} from "../../util/permissions";
import {LeitnerCardStats} from "./leitner/leitnerCardStats";
import {LeitnerLearningWorkload} from "./leitner/leitnerLearningWorkload";
import {Wozniak} from "./wozniak";
import {CardType} from "../../util/cardTypes";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const Cardsets = new Mongo.Collection("cardsets");

if (Meteor.isServer) {
	Meteor.publish("demoCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("makingOfCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("landingPageCardsets", function () {
		if (ServerStyle.gotLandingPageWordcloud()) {
			return Cardsets.find({wordcloud: true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardset", function (cardset_id) {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, kind: 1, owner: 1, cardGroups: 1}});
			if (cardset !== undefined) {
				if (cardset.kind === "personal") {
					if (!UserPermissions.isOwner(cardset.owner) && !UserPermissions.isAdmin()) {
						this.ready();
						return;
					}
				}
				if (!Meteor.userId() && cardset.kind === "edu") {
					this.ready();
				} else {
					return Cardsets.find({
						$or: [
							{_id: cardset._id},
							{_id: {$in: cardset.cardGroups}}
						]
					});
				}
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetsEditMode", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (cardset.owner === Meteor.userId() || UserPermissions.isAdmin()) {
				return Cardsets.find({
					$or: [
						{_id: cardset_id},
						{"transcript.bonus": true}
					]
				});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetsTranscripts", function () {
		if (UserPermissions.canCreateContent()) {
			return Cardsets.find({'transcriptBonus.enabled': true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("allCardsets", function () {
		if (this.userId && UserPermissions.gotBackendAccess()) {
			let query = {};
			if (!ServerStyle.gotSimplifiedNav()) {
				query.shuffled = false;
			}
			return Cardsets.find(query);
		} else {
			this.ready();
		}
	});
	Meteor.publish("allRepetitorien", function () {
		if (this.userId && UserPermissions.gotBackendAccess()) {
			return Cardsets.find({shuffled: true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("workloadCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let workload = LeitnerLearningWorkload.find({user_id: this.userId}, {fields: {cardset_id: 1}}).fetch();
			let filter = [];
			for (let i = 0, workloadLength = workload.length; i < workloadLength; i++) {
				if ((LeitnerCardStats.find({cardset_id: workload[i].cardset_id}).count() !== 0) || (Wozniak.find({cardset_id: workload[i].cardset_id}).count() !== 0)) {
					filter.push(workload[i].cardset_id);
				}
			}
			let cardsets = [];
			let cardset;
			for (let i = 0, filterLength = filter.length; i < filterLength; i++) {
				cardset = Cardsets.findOne({_id: filter[i]}, {
					fields: {
						_id: 1,
						shuffled: 1,
						cardGroups: 1
					}
				});
				if (cardset !== undefined) {
					cardsets.push(filter[i]);
					if (cardset.shuffled) {
						for (let k = 0, cardGroupsLength = cardset.cardGroups.length; k < cardGroupsLength; k++) {
							cardsets.push(cardset.cardGroups[k]);
						}
					}
				}
			}
			return Cardsets.find({_id: {$in: cardsets}});
		} else {
			this.ready();
		}
	});
	Meteor.publish("myCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let query = {owner: this.userId};
			if (!ServerStyle.gotSimplifiedNav()) {
				query.shuffled = false;
			}
			return Cardsets.find(query);
		} else {
			this.ready();
		}
	});
	Meteor.publish("personalRepetitorien", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Cardsets.find({owner: this.userId, shuffled: true});
		} else {
			this.ready();
		}
	});
	Meteor.publish("poolCardsets", function () {
		let query = {};
		if (!ServerStyle.gotSimplifiedNav()) {
			query.shuffled = false;
		}
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			query.kind = {$in: ['free', 'edu', 'pro']};
			return Cardsets.find(query);
		} else if (UserPermissions.isNotBlockedOrFirstLogin() && ServerStyle.isLoginEnabled("guest")) {
			if (ServerStyle.isLoginEnabled("pro")) {
				query.kind = {$in: ['free', 'pro']};
				return Cardsets.find(query);
			} else {
				query.kind = {$in: ['free']};
				return Cardsets.find(query);
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("repetitoriumCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.gotBackendAccess()) {
				return Cardsets.find({shuffled: true});
			} else {
				return Cardsets.find({
					$or: [
						{owner: this.userId, shuffled: true},
						{kind: {$in: ['free', 'edu', 'pro']}, shuffled: true}
					]
				});
			}
		} else if (UserPermissions.isNotBlockedOrFirstLogin() && ServerStyle.isLoginEnabled("guest")) {
			if (ServerStyle.isLoginEnabled("pro")) {
				return Cardsets.find({kind: {$in: ['free', 'pro']}, shuffled: true});
			} else {
				return Cardsets.find({kind: {$in: ['free']}, shuffled: true});
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("editShuffleCardsets", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.gotBackendAccess()) {
				return Cardsets.find({
					cardType: {$nin: CardType.getCardTypesWithTranscriptBonus()},
					$or: [
						{_id: cardset_id},
						{shuffled: false}
					]
				});
			} else {
				return Cardsets.find(
					{
						cardType: {$nin: CardType.getCardTypesWithTranscriptBonus()},
						$or: [
							{_id: cardset_id},
							{owner: this.userId, shuffled: false},
							{kind: {$in: ['free', 'edu', 'pro']}, shuffled: false}
						]
					});
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("tags", function () {
		let universityFilter = null;
		if (Meteor.settings.public.university.singleUniversity) {
			universityFilter = Meteor.settings.public.university.default;
		}
		return Cardsets.find({college: {$ifNull: [universityFilter, {$exists: true}]}}, {
			fields: {
				_id: 1,
				name: 1,
				quantity: 1,
				kind: 1
			}
		});
	});
}

const CardsetsSchema = new SimpleSchema({
	name: {
		type: String
	},
	description: {
		type: String,
		optional: true
	},
	date: {
		type: Date
	},
	dateUpdated: {
		type: Date
	},
	editors: {
		type: [String]
	},
	owner: {
		type: String
	},
	visible: {
		type: Boolean
	},
	ratings: {
		type: Boolean
	},
	kind: {
		type: String
	},
	price: {
		type: Number,
		decimal: true
	},
	reviewed: {
		type: Boolean
	},
	reviewer: {
		type: String
	},
	request: {
		type: Boolean
	},
	relevance: {
		type: Number,
		decimal: true,
		optional: true
	},
	rating: {
		type: Number,
		decimal: true
	},
	raterCount: {
		type: Number,
		decimal: true
	},
	quantity: {
		type: Number
	},
	license: {
		type: [String],
		maxCount: 4
	},
	userDeleted: {
		type: Boolean
	},
	learningActive: {
		type: Boolean,
		optional: true
	},
	maxCards: {
		type: Number,
		optional: true
	},
	daysBeforeReset: {
		type: Number,
		optional: true
	},
	learningStart: {
		type: Date,
		optional: true
	},
	learningEnd: {
		type: Date,
		optional: true
	},
	learningInterval: {
		type: [Number],
		optional: true
	},
	registrationPeriod: {
		type: Date,
		optional: true
	},
	wordcloud: {
		type: Boolean
	},
	shuffled: {
		type: Boolean
	},
	cardGroups: {
		type: [String]
	},
	cardType: {
		type: Number
	},
	difficulty: {
		type: Number
	},
	originalAuthor: {
		type: String,
		optional: true
	},
	originalAuthorName: {
		type: Object,
		optional: true,
		blackbox: true
	},
	noDifficulty: {
		type: Boolean
	},
	pomodoroTimer: {
		type: Object,
		optional: true,
		blackbox: true
	},
	workload: {
		type: Object,
		optional: true,
		blackbox: true
	},
	learnerCount: {
		type: Object,
		optional: true
	},
	'learnerCount.bonus': {
		type: Number,
		optional: true,
		defaultValue: 0
	},
	'learnerCount.normal': {
		type: Number,
		optional: true,
		defaultValue: 0
	},
	learners: {
		type: Number,
		optional: true
	},
	sortType: {
		type: Number,
		optional: true
	},
	transcriptBonus: {
		type: Object,
		optional: true,
		blackbox: true
	},
	gotWorkload: {
		type: Boolean,
		optional: true
	},
	lecturerAuthorized: {
		type: Boolean,
		optional: true
	},
	lastEditor: {
		type: String,
		optional: true
	},
	useCase: {
		type: Object
	},
	'useCase.enabled': {
		type: Boolean
	},
	'useCase.priority': {
		type: Number
	},
	fragJetzt: {
		type: Object,
		optional: true
	},
	'fragJetzt.session': {
		type: String,
		optional: true
	},
	'fragJetzt.overrideOnlyEmptySessions': {
		type: Boolean
	},
	arsnovaClick: {
		type: Object,
		optional: true
	},
	'arsnovaClick.session': {
		type: String,
		optional: true
	},
	'arsnovaClick.overrideOnlyEmptySessions': {
		type: Boolean
	},
	strictWorkloadTimer: {
		type: Boolean,
		optional: true
	},
	'forceNotifications.mail': {
		type: Boolean,
		optional: true
	},
	'forceNotifications.push': {
		type: Boolean,
		optional: true
	},
	'leitner.timelineStats': {
		type: Object,
		optional: true
	},
	'learningStatistics.answerTime': {
		type: Object,
		optional: true
	},
	'learningStatistics.answerTime.median': {
		type: Object,
		optional: true
	},
	'learningStatistics.answerTime.median.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.answerTime.median.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.answerTime.arithmeticMean': {
		type: Object,
		optional: true
	},
	'learningStatistics.answerTime.arithmeticMean.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.answerTime.arithmeticMean.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.answerTime.standardDeviation': {
		type: Object,
		optional: true
	},
	'learningStatistics.answerTime.standardDeviation.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.answerTime.standardDeviation.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.sum.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.sum.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.median.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.median.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.arithmeticMean.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.arithmeticMean.normal': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.standardDeviation.bonus': {
		type: Number,
		optional: true
	},
	'learningStatistics.workingTime.standardDeviation.normal': {
		type: Number,
		optional: true
	},
	unresolvedErrors: {
		type: Number,
		optional: true
	}
});

Cardsets.attachSchema(CardsetsSchema);
