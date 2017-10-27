import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cardsets} from "./cardsets.js";
import {Experience} from "./experience.js";
import {Learned} from "./learned.js";
import {Paid} from "./paid.js";
import {check} from "meteor/check";

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
	Meteor.publish("cards", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (Roles.userIsInRole(this.userId, [
					'admin',
					'editor',
					'lecturer'
				])) {
				if (Meteor.settings.public.university.singleUniversity) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({
								$or: [
									{college: Meteor.settings.public.university.default}
								]
							}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else {
					return Cards.find();
				}
			} else if (Roles.userIsInRole(this.userId, 'pro')) {
				if (Meteor.settings.public.university.singleUniversity) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({
								$or: [
									{owner: this.userId},
									{visible: true},
									{college: Meteor.settings.public.university.default}
								]
							}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({
								$or: [
									{owner: this.userId},
									{visible: true}
								]
							}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				}
			} else if (Roles.userIsInRole(this.userId, 'university')) {
				if (Meteor.settings.public.university.singleUniversity) {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({
								visible: true,
								college: Meteor.settings.public.university.default,
								kind: {$in: ['free', 'edu']}
							}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				} else {
					return Cards.find({
						cardset_id: {
							$in: Cardsets.find({
								visible: true,
								kind: {$in: ['free', 'edu']}
							}).map(function (cardset) {
								return cardset._id;
							})
						}
					});
				}
			} else {
				if (Meteor.settings.public.university.singleUniversity) {
					return Cards.find({
						$or: [
							//is owner
							{
								cardset_id: {
									$in: Cardsets.find({
										owner: this.userId,
										college: Meteor.settings.public.university.default
									}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//is visible and is free
							{
								cardset_id: {
									$in: Cardsets.find({
										visible: true,
										kind: 'free',
										college: Meteor.settings.public.university.default
									}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//is visible and has bought
							{
								cardset_id: {
									$in: Paid.find({
										user_id: this.userId,
										college: Meteor.settings.public.university.default,
										cardset_id: {
											$in: Cardsets.find({visible: true}).map(function (cardset) {
												return cardset._id;
											})
										}
									}).map(function (paid) {
										return paid.cardset_id;
									})
								}
							}
						]
					});
				} else {
					return Cards.find({
						$or: [
							//is owner
							{
								cardset_id: {
									$in: Cardsets.find({owner: this.userId}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//is visible and is free
							{
								cardset_id: {
									$in: Cardsets.find({
										visible: true,
										kind: 'free'
									}).map(function (cardset) {
										return cardset._id;
									})
								}
							},
							//is visible and has bought
							{
								cardset_id: {
									$in: Paid.find({
										user_id: this.userId,
										cardset_id: {
											$in: Cardsets.find({visible: true}).map(function (cardset) {
												return cardset._id;
											})
										}
									}).map(function (paid) {
										return paid.cardset_id;
									})
								}
							}
						]
					});
				}
			}
		}
	});

	Meteor.publish("previewCards", function (cardset_id) {
		check(cardset_id, String);

		if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (this.userId === Cardsets.findOne({_id: cardset_id}).owner) {
				return Cards.find({cardset_id: cardset_id});
			}

			var count = Cards.find({cardset_id: cardset_id}).count();
			var limit = count * 0.1;

			if (limit < 2) {
				limit = 2;
			} else if (limit > 15) {
				limit = 15;
			}

			return Cards.find({cardset_id: cardset_id}, {limit: limit});
		}
	});
}

var CardsSchema = new SimpleSchema({
	subject: {
		type: String,
		max: 150
	},
	hint: {
		type: String,
		optional: true,
		max: 10000
	},
	front: {
		type: String,
		max: 10000
	},
	back: {
		type: String,
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
	}
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
	addCard: function (cardset_id, subject, hint, front, back, difficulty, cardGroup) {
		check(cardset_id, String);
		check(subject, String);
		check(hint, String);
		check(front, String);
		check(back, String);
		check(difficulty, Number);
		check(cardGroup, String);
		// Make sure the user is logged in and is authorized
		var cardset = Cardsets.findOne(cardset_id);
		let card_id = "";
		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (!cardset.shuffled) {
			cardGroup = "0";
		}
		Cards.insert({
			subject: subject,
			hint: hint,
			front: front,
			back: back,
			cardset_id: cardset_id,
			difficulty: difficulty,
			cardGroup: cardGroup
		}, function (err, card) {
			card_id = card;
		});
		Cardsets.update(cardset_id, {
			$set: {
				quantity: Cards.find({cardset_id: cardset_id}).count(),
				dateUpdated: new Date()
			}
		});
		Experience.insert({
			type: 3,
			value: 2,
			date: new Date(),
			owner: Meteor.userId()
		});
		Meteor.call('checkLvl');
		return card_id;
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
		Learned.remove({
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
			Learned.remove({
				card_id: card_id
			});
		}
	},
	updateCard: function (card_id, subject, hint, front, back, difficulty) {
		check(card_id, String);
		check(subject, String);
		check(hint, String);
		check(front, String);
		check(back, String);
		check(difficulty, Number);
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

		Cards.update(card_id, {
			$set: {
				subject: subject,
				hint: hint,
				front: front,
				back: back,
				difficulty: difficulty
			}
		});
		Cardsets.update(card.cardset_id, {
			$set: {
				dateUpdated: new Date()
			}
		});
	}
});
