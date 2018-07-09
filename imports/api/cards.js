import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cardsets} from "./cardsets.js";
import {Leitner, Wozniak} from "./learned.js";
import {Paid} from "./paid.js";
import {check} from "meteor/check";
import {CardEditor} from "./cardEditor";
import {getShuffledCardsetReferences} from "./cardsets";

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
	Meteor.publish("cards", function () {
		if (this.userId) {
			if (!Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				let paidCardsets = Paid.find({user_id: this.userId}).map(function (paid) {
					return paid.cardset_id;
				});
				if (Roles.userIsInRole(this.userId, [
					'admin',
					'editor',
					'lecturer'
				])) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({kind: {$nin: ['server']}}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else if (Roles.userIsInRole(this.userId, 'pro')) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find(
								{
									$or: [
										{owner: this.userId},
										{visible: true},
										{_id: {$in: paidCardsets}},
										{_id: {$in: getShuffledCardsetReferences(['free', 'edu', 'pro'])}}
									]
								}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else if (Roles.userIsInRole(this.userId, 'university')) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find(
								{
									$or: [
										{owner: this.userId},
										{
											visible: true,
											kind: {$in: ['demo', 'free', 'edu']}
										},
										{_id: {$in: paidCardsets}},
										{_id: {$in: getShuffledCardsetReferences(['free', 'edu'])}}
									]
								}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find(
								{
									$or: [
										{owner: this.userId},
										{
											visible: true,
											kind: {$in: ['demo', 'free']}
										},
										{_id: {$in: paidCardsets}},
										{_id: {$in: getShuffledCardsetReferences(['free'])}}
									]
								}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				}
			}
		} else {
			return Cards.find({
				cardset_id: {
					$in: Cardsets.find(
						{
							kind: {$in: ['demo']}
						}).map(function (cardset) {
						return cardset._id;
					})
				}
			});
		}
	});

	Meteor.publish("previewCards", function (cardset_id) {
		check(cardset_id, String);
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]) && Cardsets.findOne({_id: cardset_id}).visible === true) {
			let count = Cards.find({cardset_id: cardset_id}).count();
			let cardIdArray = Cards.find({cardset_id: cardset_id}, {_id: 1}).map(function (card) {
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
			return Cards.find({cardset_id: cardset_id, _id: {$in: cardIdArray}});
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
	difficulty: {
		type: Number
	},
	centerText: {
		type: Boolean,
		optional: true
	},
	centerTextElement: {
		type: [Boolean]
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
	learningIndex: {
		type: String,
		optional: true
	},
	learningUnit: {
		type: String,
		optional: true
	},
	cardType: {
		type: Number
	},
	originalAuthor: {
		type: String,
		optional: true
	}
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
	addCard: function (cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, date, learningGoalLevel, backgroundStyle, learningIndex, learningUnit) {
		check(cardset_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(date, Date);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		check(learningIndex, String);
		check(learningUnit, String);
		// Make sure the user is logged in and is authorized
		var cardset = Cardsets.findOne(cardset_id);
		let card_id = "";
		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (cardset.owner !== Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}
		if (cardset.cardType !== 2 || cardset.cardType !== 3 || cardset.cardType !== 5) {
			if (subject === "") {
				throw new Meteor.Error("Missing subject");
			}
		} else {
			if (subject === "" && learningUnit === "") {
				throw new Meteor.Error("Missing subject or reference");
			}
		}
		Cards.insert({
			subject: subject.trim(),
			front: content1,
			back: content2,
			hint: content3,
			lecture: content4,
			top: content5,
			bottom: content6,
			cardset_id: cardset_id,
			difficulty: cardset.difficulty,
			centerTextElement: centerTextElement,
			date: date,
			learningGoalLevel: learningGoalLevel,
			backgroundStyle: backgroundStyle,
			learningIndex: learningIndex,
			learningUnit: learningUnit,
			cardType: cardset.cardType
		}, {trimStrings: false}, function (err, card) {
			card_id = card;
		});
		Cardsets.update(cardset_id, {
			$set: {
				quantity: Cards.find({cardset_id: cardset_id}).count(),
				dateUpdated: new Date()
			}
		});
		Meteor.call('updateShuffledCardsetQuantity', cardset_id);
		return card_id;
	},
	copyCard: function (sourceCardset_id, targetCardset_id, card_id) {
		check(sourceCardset_id, String);
		check(targetCardset_id, String);
		check(card_id, String);
		let cardset = Cardsets.findOne(sourceCardset_id);
		if (Roles.userIsInRole(Meteor.userId(), ['admin']) || cardset.owner === Meteor.userId()) {
			let card = Cards.findOne(card_id);
			if (card !== undefined) {
				let content1 = "";
				let content2 = "";
				let content3 = "";
				let content4 = "";
				let content5 = "";
				let content6 = "";
				let learningUnit = "";
				let learningIndex = -1;
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
				if (card.learningUnit !== undefined) {
					learningUnit = card.learningUnit;
				}
				Meteor.call("addCard", targetCardset_id, card.subject, content1, content2, content3, content4, content5, content6, "0", card.centerTextElement, card.date, card.learningGoalLevel, card.backgroundStyle, learningIndex, learningUnit);
				return true;
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	deleteCard: function (card_id) {
		check(card_id, String);

		var card = Cards.findOne(card_id);
		var cardset = Cardsets.findOne(card.cardset_id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

		if (cardset.learningActive) {
			throw new Meteor.Error("not-possible active learnphase");
		}

		var countCards = Cards.find({cardset_id: cardset._id}).count();
		if (countCards <= 5) {
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
		Cardsets.update(card.cardset_id, {
			$set: {
				quantity: Cards.find({cardset_id: card.cardset_id}).count(),
				dateUpdated: new Date()
			}
		});

		Meteor.call('updateShuffledCardsetQuantity', cardset._id);

		Leitner.remove({
			card_id: card_id
		});
		Wozniak.remove({
			card_id: card_id
		});
	},
	deleteCardAdmin: function (card_id) {
		check(card_id, String);

		var card = Cards.findOne({_id: card_id});
		if (card !== undefined) {
			if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
				throw new Meteor.Error("not-authorized");
			}

			Cards.remove(card_id);
			Cardsets.update(card.cardset_id, {
				$set: {
					quantity: Cards.find({cardset_id: card.cardset_id}).count(),
					dateUpdated: new Date()
				}
			});
			Meteor.call('updateShuffledCardsetQuantity', card.cardset_id);
			Leitner.remove({
				card_id: card_id
			});
			Wozniak.remove({
				card_id: card_id
			});
		}
	},
	updateCard: function (card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, learningGoalLevel, backgroundStyle, learningIndex, learningUnit) {
		check(card_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		check(learningIndex, String);
		check(learningUnit, String);
		var card = Cards.findOne(card_id);
		var cardset = Cardsets.findOne(card.cardset_id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			// Make sure the user is logged in and is authorized
			if (!Meteor.userId() || (cardset.owner !== Meteor.userId() || cardset.editors.includes(Meteor.userId())) || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}
		if (cardset.cardType !== 2 || cardset.cardType !== 3 || cardset.cardType !== 5) {
			if (subject === "") {
				throw new Meteor.Error("Missing subject");
			}
		} else {
			if (subject === "" && learningUnit === "") {
				throw new Meteor.Error("Missing subject or reference");
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
				learningGoalLevel: learningGoalLevel,
				backgroundStyle: backgroundStyle,
				learningIndex: learningIndex,
				learningUnit: learningUnit,
				dateUpdated: new Date()
			}
		}, {trimStrings: false});
		Cardsets.update(card.cardset_id, {
			$set: {
				dateUpdated: new Date()
			}
		});
	}
});
