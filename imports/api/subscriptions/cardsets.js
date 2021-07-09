import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../util/styles";
import {UserPermissions} from "../../util/permissions";
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
			if (cardset !== undefined && cardset.kind !== 'server' && cardset.kind !== 'demo') {
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
			if (cardset !== undefined && cardset.kind !== 'server'  && cardset.kind !== 'demo' && (cardset.owner === Meteor.userId() || UserPermissions.isAdmin())) {
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
			query.kind = {$nin: ['server', 'demo']};
			if (!ServerStyle.gotSimplifiedNav()) {
				query.shuffled = false;
			}
			return Cardsets.find(query);
		} else {
			this.ready();
		}
	});
	Meteor.publish("allRepetitorien", function () {
		let query = {};
		query.kind = {$nin: ['server', 'demo']};
		query.shuffled = true;
		if (this.userId && UserPermissions.gotBackendAccess()) {
			return Cardsets.find(query);
		} else {
			this.ready();
		}
	});
	Meteor.publish("workloadCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardsetFilter = LeitnerLearningWorkload.find({
				user_id: Meteor.userId(),
				isActive: true
			}).fetch().map(leitner => leitner.cardset_id);
			cardsetFilter.concat(Wozniak.find({
				user_id: Meteor.userId()
			}).fetch().map(wozniak => wozniak.cardset_id));
			return Cardsets.find({_id: {$in: cardsetFilter}});
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
	unresolvedErrors: {
		type: Number,
		optional: true
	},
	bonusStatus: {
		type: Number,
		defaultValue: 0
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
	learningStatistics: {
		type: Object,
		optional: true
	}
});

Cardsets.attachSchema(CardsetsSchema);
