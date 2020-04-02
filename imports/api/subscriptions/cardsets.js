import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../styles";
import {UserPermissions} from "../permissions";
import {Leitner} from "./leitner";
import {Workload} from "./workload";
import {Wozniak} from "./wozniak";
import {CardType} from "../cardTypes";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const Cardsets = new Mongo.Collection("cardsets");

if (Meteor.isServer) {
	Meteor.publish("demoCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("makingOfCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("wordcloudCardsets", function () {
		return Cardsets.find({wordcloud: true});
	});
	Meteor.publish("cardset", function (cardset_id) {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, kind: 1, owner: 1, cardGroups: 1}});
			if (cardset.kind === "personal") {
				if (!UserPermissions.isOwner(cardset.owner) && !UserPermissions.isAdmin()) {
					this.ready();
					return;
				}
			}
			if (!this.userId && cardset.kind === "edu") {
				this.ready();
				return;
			}
			return Cardsets.find({
				$or: [
					{_id: cardset._id},
					{_id: {$in: cardset.cardGroups}}
				]
			});
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
			return Cardsets.find({shuffled: false});
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
			let workload = Workload.find({user_id: this.userId}, {fields: {cardset_id: 1}}).fetch();
			let filter = [];
			for (let i = 0, workloadLength = workload.length; i < workloadLength; i++) {
				if ((Leitner.find({cardset_id: workload[i].cardset_id}).count() !== 0) || (Wozniak.find({cardset_id: workload[i].cardset_id}).count() !== 0)) {
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
			return Cardsets.find({owner: this.userId, shuffled: false});
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
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Cardsets.find({kind: {$in: ['free', 'edu', 'pro']}, shuffled: false});
		} else if (UserPermissions.isNotBlockedOrFirstLogin() && ServerStyle.isLoginEnabled("guest")) {
			if (ServerStyle.isLoginEnabled("pro")) {
				return Cardsets.find({kind: {$in: ['free', 'pro']}, shuffled: false});
			} else {
				return Cardsets.find({kind: {$in: ['free']}, shuffled: false});
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
		type: Boolean
	},
	maxCards: {
		type: Number
	},
	daysBeforeReset: {
		type: Number
	},
	learningStart: {
		type: Date
	},
	learningEnd: {
		type: Date
	},
	learningInterval: {
		type: [Number]
	},
	registrationPeriod: {
		type: Date
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
	}
});

Cardsets.attachSchema(CardsetsSchema);
