import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cardsets} from "./cardsets.js";
import {Leitner, Wozniak} from "./learned.js";
import {Paid} from "./paid.js";
import {check} from "meteor/check";

export const Cards = new Mongo.Collection("cards");


if (Meteor.isServer) {
	let universityFilter = {$ne: null};
	if (Meteor.settings.public.university.singleUniversity) {
		universityFilter = Meteor.settings.public.university.default;
	}
	Meteor.publish("cards", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
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
						$in: Cardsets.find({college: universityFilter}).map(function (cardset) {
							return cardset._id;
						})
					}
				});
			} else if (Roles.userIsInRole(this.userId, 'pro')) {
				return Cards.find({
					cardset_id: {
						$in: Cardsets.find(
							{
								college: universityFilter,
								$or: [
									{owner: this.userId},
									{visible: true},
									{cardset_id: {$in: paidCardsets}}
								]
							}).map(function (cardset) {
							return cardset._id;
						})
					}
				});
			} else if (Roles.userIsInRole(this.userId, 'university')) {
				return Cards.find(
					{
						$or: [
							{
								cardset_id: {
									$in: Cardsets.find(
										{
											college: universityFilter,
											visible: true,
											kind: {$in: ['free', 'edu']}
										}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							{cardset_id: {$in: paidCardsets}}
						]
					});
			} else {
				return Cards.find(
					{
						$or: [
							//is owner
							{
								cardset_id: {
									$in: Cardsets.find(
										{
											college: universityFilter,
											owner: this.userId
										}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//is visible and is free
							{
								cardset_id: {
									$in: Cardsets.find(
										{
											college: universityFilter,
											visible: true,
											kind: 'free'
										}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//has bought
							{
								cardset_id: {
									$in: Cardsets.find(
										{
											_id: {$in: paidCardsets},
											college: universityFilter
										}).map(function (cardset) {
										return cardset._id;
									})
								}
							}
						]
					});
			}
		}
	});

	Meteor.publish("previewCards", function (cardset_id) {
		check(cardset_id, String);
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
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
		max: 150
	},
	hint: {
		type: String,
		optional: true,
		max: 10000
	},
	front: {
		type: String,
		optional: true,
		max: 10000
	},
	back: {
		type: String,
		optional: true,
		max: 10000
	},
	cardset_id: {
		type: String
	},
	difficulty: {
		type: Number
	},
	cardGroup: {
		type: String
	},
	lecture: {
		type: String,
		optional: true,
		max: 30000
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
	learningGoalLevel: {
		type: Number
	},
	backgroundStyle: {
		type: Number
	},
	learningUnit: {
		type: String,
		optional: true
	},
	cardType: {
		type: Number
	}
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
	addCard: function (cardset_id, subject, hint, front, back, difficulty, cardGroup, lecture, centerTextElement, date, learningGoalLevel, backgroundStyle, learningUnit) {
		check(cardset_id, String);
		check(subject, String);
		check(hint, String);
		check(front, String);
		check(back, String);
		check(difficulty, Number);
		check(cardGroup, String);
		check(lecture, String);
		check(centerTextElement, [Boolean]);
		check(date, Date);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		check(learningUnit, String);
		// Make sure the user is logged in and is authorized
		var cardset = Cardsets.findOne(cardset_id);
		let card_id = "";
		if (cardset.owner !== Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (!cardset.shuffled) {
			cardGroup = "0";
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
			hint: hint,
			front: front,
			back: back,
			cardset_id: cardset_id,
			difficulty: difficulty,
			cardGroup: cardGroup,
			lecture: lecture,
			centerTextElement: centerTextElement,
			date: date,
			learningGoalLevel: learningGoalLevel,
			backgroundStyle: backgroundStyle,
			learningUnit: learningUnit,
			cardType: cardset.cardType
		}, function (err, card) {
			card_id = card;
		});
		Cardsets.update(cardset_id, {
			$set: {
				quantity: Cards.find({cardset_id: cardset_id}).count(),
				dateUpdated: new Date()
			}
		});
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
				let hint = "";
				let lecture = "";
				let back = "";
				let learningUnit = "";
				if (card.back !== undefined) {
					back = card.back;
				}
				if (card.hint !== undefined) {
					hint = card.hint;
				}
				if (card.lecture !== undefined) {
					lecture = card.lecture;
				}
				if (card.learningUnit !== undefined) {
					learningUnit = card.learningUnit;
				}
				Meteor.call("addCard", targetCardset_id, card.subject, hint, card.front, back, Number(card.difficulty), "0", card.cardType, lecture, card.centerTextElement, card.date, card.learningGoalLevel, card.backgroundStyle, learningUnit);
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

		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
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
			Leitner.remove({
				card_id: card_id
			});
			Wozniak.remove({
				card_id: card_id
			});
		}
	},
	updateCard: function (card_id, subject, hint, front, back, difficulty, lecture, centerTextElement, date, learningGoalLevel, backgroundStyle, learningUnit) {
		check(card_id, String);
		check(subject, String);
		check(hint, String);
		check(front, String);
		check(back, String);
		check(difficulty, Number);
		check(lecture, String);
		check(centerTextElement, [Boolean]);
		check(date, Date);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
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
				hint: hint,
				front: front,
				back: back,
				difficulty: difficulty,
				lecture: lecture,
				centerTextElement: centerTextElement,
				date: date,
				learningGoalLevel: learningGoalLevel,
				backgroundStyle: backgroundStyle,
				learningUnit: learningUnit,
				cardType: cardset.cardType
			}
		});
		Cardsets.update(card.cardset_id, {
			$set: {
				dateUpdated: new Date()
			}
		});
	}
});
