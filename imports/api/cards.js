import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Cardsets} from "./cardsets.js";
import {Experience} from "./experience.js";
import {Learned} from "./learned.js";
import {Paid} from "./paid.js";
import {SimpleSchema} from "meteor/aldeed:simple-schema";


export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
	Meteor.publish("cards", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			if (Roles.userIsInRole(this.userId, [
					'admin',
					'editor',
					'lecturer'
				])) {
				return Cards.find();
			} else if (Roles.userIsInRole(this.userId, 'pro')) {
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
	});

	Meteor.publish("previewCards", function (cardset_id) {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
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
	}
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
	addCard: function (cardset_id, front, back) {
		// Make sure the user is logged in and is authorized
		var cardset = Cardsets.findOne(cardset_id);
		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		}
		Cards.insert({
			front: front,
			back: back,
			cardset_id: cardset_id
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
	},
	deleteCard: function (card_id) {
		var card = Cards.findOne(card_id);
		var cardset = Cardsets.findOne(card.cardset_id);

		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
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
	updateCard: function (card_id, front, back) {
		var card = Cards.findOne(card_id);
		var cardset = Cardsets.findOne(card.cardset_id);

		if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			// Make sure the user is logged in and is authorized
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cards.update(card_id, {
			$set: {
				front: front,
				back: back
			}
		});
		Cardsets.update(card.cardset_id, {
			$set: {
				dateUpdated: new Date()
			}
		});
	}
});
