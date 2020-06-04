import {Mongo} from "meteor/mongo";
import {Cardsets} from "../subscriptions/cardsets";
import {Meteor} from "meteor/meteor";
import {TranscriptBonus} from "./transcriptBonus";
import {TranscriptBonusList} from "../transcriptBonus";
import {UserPermissions} from "../permissions";
import {ServerStyle} from "../styles";
import {Paid} from "./paid";
import {CardType} from "../cardTypes";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {CardEditor} from "../cardEditor";

export const Cards = new Mongo.Collection("cards");

function getPreviewCards(cardset_id) {
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1, cardGroups: 1, kind: 1}});
	let filterQuery = {
		$or: [
			{cardset_id: cardset._id},
			{cardset_id: {$in: cardset.cardGroups}}
		]
	};
	let count = Cards.find(filterQuery).count();
	let cardIdArray = Cards.find(filterQuery, {_id: 1}).map(function (card) {
		return card._id;
	});
	let limit;

	if (count < 10) {
		limit = 2;
	} else {
		limit = 5;
	}

	let j, x, i;
	for (i = cardIdArray.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = cardIdArray[i];
		cardIdArray[i] = cardIdArray[j];
		cardIdArray[j] = x;
	}
	while (cardIdArray.length > limit) {
		cardIdArray.pop();
	}
	return Cards.find({_id: {$in: cardIdArray}});
}

if (Meteor.isServer) {
	Meteor.publish("demoCards", function () {
		return Cards.find({
			cardset_id: {
				$in: Cardsets.find({kind: "demo"}).map(function (cardset) {
					return cardset._id;
				})
			}
		});
	});
	Meteor.publish("allCards", function () {
		if (this.userId) {
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
				return Cards.find();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("myTranscriptCards", function () {
		if (this.userId) {
			let bonusTranscripts = TranscriptBonus.find({owner: this.user_id}).fetch();
			let cardFilter = [];
			for (let i = 0; i < bonusTranscripts.length; i++) {
				cardFilter.push(bonusTranscripts[i].card_id);
			}
			return Cards.find({_id: {$nin: cardFilter}, owner: this.userId, cardType: 2, cardset_id: "-1"});
		} else {
			this.ready();
		}
	});
	Meteor.publish("myBonusTranscriptCards", function () {
		if (this.userId) {
			let bonusTranscripts = TranscriptBonus.find({owner: this.user_id}).fetch();
			let cardFilter = [];
			for (let i = 0; i < bonusTranscripts.length; i++) {
				cardFilter.push(bonusTranscripts[i].card_id);
			}
			return Cards.find({_id: {$in: cardFilter}, owner: this.userId, cardType: 2, cardset_id: "-1"});
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetTranscriptBonusCards", function (cardset_id) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let bonusTranscripts = TranscriptBonus.find({cardset_id: cardset._id}).fetch();
				let cardFilter = [];
				for (let i = 0; i < bonusTranscripts.length; i++) {
					cardFilter.push(bonusTranscripts[i].card_id);
				}
				return Cards.find({_id: {$in: cardFilter}, cardType: 2, cardset_id: "-1"});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetTranscriptBonusCardsReview", function (cardset_id, filterID = undefined) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(cardset._id);
				if (latestExpiredDeadline !== undefined) {
					let transcriptQuery = {cardset_id: cardset._id, date: {$lt: latestExpiredDeadline}, rating: 0};
					if (filterID !== undefined && filterID !== null) {
						transcriptQuery.card_id = filterID;
					}
					let bonusTranscripts = TranscriptBonus.find(transcriptQuery, {fields: {card_id: 1}}).fetch();
					let cardFilter = [];
					for (let i = 0; i < bonusTranscripts.length; i++) {
						cardFilter.push(bonusTranscripts[i].card_id);
					}
					let query = {};
					query._id = {$in: cardFilter};
					query.cardType = 2;
					query.cardset_id = "-1";
					return Cards.find(query);
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
	Meteor.publish("transcriptCard", function (card_id) {
		if (UserPermissions.isAdmin()) {
			return Cards.find({_id: card_id, cardType: 2, cardset_id: "-1"});
		} else if (this.userId) {
			return Cards.find({_id: card_id, owner: this.userId, cardType: 2, cardset_id: "-1"});
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetCards", function (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1, cardGroups: 1, kind: 1}});
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin() && cardset !== undefined) {
			let paidCardsets = Paid.findOne({user_id: this.userId, cardset_id: cardset._id});
			let filteredCardGroups = [];
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				let tempCardset = Cardsets.findOne({_id: cardset.cardGroups[i]}, {fields: {cardType: 1}});
				if (tempCardset !== undefined) {
					if (!CardType.gotTranscriptBonus(tempCardset.cardType)) {
						filteredCardGroups.push(cardset.cardGroups[i]);
					}
				}
			}
			let filterQuery = {
				$or: [
					{cardset_id: cardset._id},
					{cardset_id: {$in: filteredCardGroups}}
				]
			};
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor',
				'lecturer'
			])) {
				return Cards.find(filterQuery);
			} else if (Roles.userIsInRole(this.userId, 'pro')) {
				if (cardset.owner === this.userId || cardset.kind !== "personal") {
					return Cards.find(filterQuery);
				} else {
					return getPreviewCards(cardset._id);
				}
			} else if (Roles.userIsInRole(this.userId, 'university')) {
				if (cardset.owner === this.userId || cardset.kind === "free" || cardset.kind === "edu" || paidCardsets !== undefined) {
					return Cards.find(filterQuery);
				} else {
					return getPreviewCards(cardset._id);
				}
			} else if (this.userId) {
				if (cardset.owner === this.userId || cardset.kind === "free" || paidCardsets !== undefined) {
					return Cards.find(filterQuery);
				} else {
					return getPreviewCards(cardset._id);
				}
			} else {
				if (cardset.kind === "free") {
					return Cards.find(filterQuery);
				} else {
					return getPreviewCards(cardset._id);
				}
			}
		} else {
			this.ready();
		}
	});
}

var CardsSchema = new SimpleSchema({
	subject: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(1)
	},
	front: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	back: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	hint: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	lecture: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	top: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	bottom: {
		type: String,
		optional: true,
		max: CardEditor.getMaxTextLength(2)
	},
	cardset_id: {
		type: String
	},
	centerText: {
		type: Boolean,
		optional: true
	},
	centerTextElement: {
		type: [Boolean]
	},
	alignType: {
		type: [Number],
		optional: true
	},
	date: {
		type: Date,
		optional: true
	},
	dateUpdated: {
		type: Date,
		optional: true
	},
	learningGoalLevel: {
		type: Number
	},
	backgroundStyle: {
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
	owner: {
		type: String,
		optional: true
	},
	cardType: {
		type: Number,
		optional: true
	},
	lastEditor: {
		type: String,
		optional: true
	},
	learningTime: {
		type: Object,
		optional: true
	},
	"learningTime.initial": {
		type: SimpleSchema.decimal,
		optional: true
	},
	"learningTime.repeated": {
		type: SimpleSchema.decimal,
		optional: true
	},
	answers: {
		type: Object,
		optional: true
	},
	"answers.rightAnswers": {
		type: [Number],
		optional: true
	},
	"answers.randomized": {
		type: Boolean,
		optional: true
	},
	"answers.content": {
		type: [Object],
		optional: true,
		blackbox: true
	}
});

Cards.attachSchema(CardsSchema);
