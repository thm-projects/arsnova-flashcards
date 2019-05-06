import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cardsets} from "./cardsets.js";
import {Leitner, Wozniak} from "./learned.js";
import {Paid} from "./paid.js";
import {check} from "meteor/check";
import {CardEditor} from "./cardEditor";
import {UserPermissions} from "./permissions";
import {ServerStyle} from "./styles";
import {TranscriptBonus, TranscriptBonusList} from "./transcriptBonus";
import {CardType} from "./cardTypes";

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
	}
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
	addCard: function (cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, transcriptBonusUser) {
		check(cardset_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(alignType, [Number]);
		check(date, Date);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		// Make sure the user is logged in and is authorized
		let cardset = Cardsets.findOne(cardset_id);
		let isOwner = false;
		let cardType;
		if (cardset_id === "-1") {
			isOwner = true;
			cardType = 2;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
			cardType = cardset.cardType;
		}

		if (UserPermissions.isAdmin() || isOwner) {
			if (subject === "" && transcriptBonusUser === undefined) {
				throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
			}
			if (transcriptBonusUser) {
				if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
					throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
				}
			}
			let card_id = Cards.insert({
				subject: subject.trim(),
				front: content1,
				back: content2,
				hint: content3,
				lecture: content4,
				top: content5,
				bottom: content6,
				cardset_id: cardset_id,
				centerTextElement: centerTextElement,
				alignType: alignType,
				date: date,
				learningGoalLevel: learningGoalLevel,
				backgroundStyle: backgroundStyle,
				owner: Meteor.userId(),
				cardType: cardType,
				dateUpdated: new Date()
			}, {trimStrings: false});
			if (transcriptBonusUser) {
				Meteor.call("addTranscriptBonus", card_id, transcriptBonusUser.cardset_id, Meteor.userId(), Number(transcriptBonusUser.date_id));
			}
			if (cardset_id !== "-1") {
				Cardsets.update(cardset_id, {
					$set: {
						quantity: Cards.find({cardset_id: cardset_id}).count(),
						dateUpdated: new Date()
					}
				});
				Meteor.call('updateShuffledCardsetQuantity', cardset_id);
				let cardsets = Cardsets.find({
					$or: [
						{_id: cardset_id},
						{cardGroups: {$in: [cardset_id]}}
					]
				}, {fields: {_id: 1}}).fetch();
				for (let i = 0; i < cardsets.length; i++) {
					Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
				}
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}
			return card_id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	copyCard: function (sourceCardset_id, targetCardset_id, card_id) {
		check(sourceCardset_id, String);
		check(targetCardset_id, String);
		check(card_id, String);
		let cardset = Cardsets.findOne(sourceCardset_id);
		let isOwner = false;
		if (sourceCardset_id === "-1") {
			isOwner = true;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
		}
		if (UserPermissions.isAdmin() || isOwner) {
			let card = Cards.findOne(card_id);
			if (card !== undefined) {
				let content1 = "";
				let content2 = "";
				let content3 = "";
				let content4 = "";
				let content5 = "";
				let content6 = "";
				if (card.front !== undefined) {
					content1 = card.front;
				}
				if (card.back !== undefined) {
					content2 = card.back;
				}
				if (card.hint !== undefined) {
					content3 = card.hint;
				}
				if (card.lecture !== undefined) {
					content4 = card.lecture;
				}
				if (card.top !== undefined) {
					content5 = card.top;
				}
				if (card.bottom !== undefined) {
					content6 = card.bottom;
				}
				Meteor.call("addCard", targetCardset_id, card.subject, content1, content2, content3, content4, content5, content6, "0", card.centerTextElement, card.alignType, card.date, card.learningGoalLevel, card.backgroundStyle);
				return true;
			}
		} else {
			throw new Meteor.Error("not-authorizedmyBonusTranscriptCards");
		}
	},
	deleteTranscript: function (card_id) {
		let card = Cards.findOne(card_id);
		if (card.owner === Meteor.userId() || UserPermissions.isAdmin()) {
			let result = Cards.remove(card_id);
			TranscriptBonus.remove({card_id: card_id});
			Meteor.call('updateTranscriptCount', Meteor.userId());
			return result;
		}
	},
	deleteCard: function (card_id) {
		check(card_id, String);

		let card = Cards.findOne(card_id);
		let cardset = Cardsets.findOne(card.cardset_id);
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			var countCards = Cards.find({cardset_id: cardset._id}).count();
			if (countCards < 1 && !CardType.gotTranscriptBonus(cardset.cardType)) {
				Cardsets.update(cardset._id, {
					$set: {
						kind: 'personal',
						reviewed: false,
						request: false,
						visible: false
					}
				});
			}

			Cards.remove(card_id);
			if (card.cardset_id !== "-1") {
				Cardsets.update(card.cardset_id, {
					$set: {
						quantity: Cards.find({cardset_id: card.cardset_id}).count(),
						dateUpdated: new Date()
					}
				});

				Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}

			Leitner.remove({
				card_id: card_id
			});
			Wozniak.remove({
				card_id: card_id
			});
			return Cards.find({cardset_id: card.cardset_id}).count();
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateCard: function (card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement,alignType, learningGoalLevel, backgroundStyle, transcriptBonusUser) {
		check(card_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(alignType, [Number]);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		let card = Cards.findOne(card_id);
		let cardset = Cardsets.findOne(card.cardset_id);
		let isOwner = false;
		if (transcriptBonusUser === null) {
			transcriptBonusUser = undefined;
		}
		let transcriptBonusDatabase = TranscriptBonus.findOne({card_id: card_id});
		if (card.cardset_id === "-1" && card.owner === Meteor.userId()) {
			isOwner = true;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
		}
		if (UserPermissions.isAdmin() || isOwner) {
			if (subject === "" && transcriptBonusUser === undefined) {
				throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
			}
			if (transcriptBonusUser === undefined) {
				TranscriptBonus.remove({card_id: card_id});
			} else {
				if (transcriptBonusDatabase === undefined) {
					if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
						throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
					}
					Meteor.call("addTranscriptBonus", card_id, transcriptBonusUser.cardset_id, Meteor.userId(), Number(transcriptBonusUser.date_id));
				} else {
					TranscriptBonusList.checkForUpdate(card_id, Meteor.userId(), transcriptBonusUser, transcriptBonusDatabase, transcriptBonusUser.date_id);
				}
			}
			Cards.update(card_id, {
				$set: {
					subject: subject.trim(),
					front: content1,
					back: content2,
					hint: content3,
					lecture: content4,
					top: content5,
					bottom: content6,
					centerTextElement: centerTextElement,
					alignType: alignType,
					learningGoalLevel: learningGoalLevel,
					backgroundStyle: backgroundStyle,
					dateUpdated: new Date()
				}
			}, {trimStrings: false});
			Cardsets.update(card.cardset_id, {
				$set: {
					dateUpdated: new Date()
				}
			});
			return true;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	}
});
