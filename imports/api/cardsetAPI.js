import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {JsonRoutes} from "meteor/simple:json-routes";
import {Cards} from "./cards.js";
import {Cardsets} from "./cardsets.js";
import {check} from "meteor/check";

export const APIAccess = new Mongo.Collection("apiAccess");

/*
* function to automatically generate the mongo modifier for an update.
* checks which attributes have changed.
*/
function mongoReplacementModifier(keep, change) {
	var $unset = {};
	for (var key in change) {
		if (keep[key] === undefined) {
			$unset[key] = "";
		}
	}
	var copy = _.clone(keep);
	delete copy._id;
	return {$set: copy, $unset: $unset};
}

if (Meteor.isServer) {
	Meteor.publish("apiAccess", function () {
		if (Roles.userIsInRole(this.userId, 'admin')) {
			return APIAccess.find();
		}
	});

	JsonRoutes.add("post", "/cardsets/:id", function (req, res) {
		var id = req.params.id;
		var token = req.query.token;

		var at = APIAccess.findOne({token: token});

		if (!at || at.cardset_id !== id) {
			JsonRoutes.sendResult(res, {
				data: "permission denied"
			});
		} else {
			var cards = req.body;
			var retCards = [];

			// get all current card ids to eliminate old ones
			var cardsetCards = Cards.find({cardset_id: id}, {fields: {_id: 1}}).fetch().map(c => c._id);

			cards.forEach(function (card) {
				card.cardset_id = id;
				if (card._id != null && card._id !== "") {
					for (let i = 0; i < cardsetCards.length; i++) {
						if (cardsetCards[i]._id === card._id) {
							cardsetCards.remove(card._id);
							break;
						}
					}
					var oldCard = Cards.findOne({_id: card._id});
					var modifier = mongoReplacementModifier(card, oldCard);
					Cards.update(card._id, modifier);
				} else {
					card.id = Cards.insert(card);
				}
				retCards.push(card);
			});

			Cards.remove({_id: {$in: cardsetCards}});

			Cardsets.update(id, {
				$set: {
					quantity: cards.length,
					dateUpdated: new Date()
				}
			});

			JsonRoutes.sendResult(res, {
				data: JSON.stringify(retCards)
			});
		}
	});
}

var APIAccessSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	token: {
		type: String
	}
});

APIAccess.attachSchema(APIAccessSchema);

Meteor.methods({
	/**
	 * Create new API access for a given cardset.
	 * Autogenerates token.
	 * @param {String} cardsetId - Database id of the cardset to be accessed via API
	 */
	newAPIAccess: function (cardsetId) {
		check(cardsetId, String);

		if (!Roles.userIsInRole(this.userId, ['admin'])) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardsetId});
			if (!cardset) {
				throw new Meteor.Error("no access to a cardset with id: " + cardsetId);
			} else {
				let token = Random.secret();
				let apiToken = {
					cardset_id: cardsetId,
					token: token
				};
				APIAccess.insert(apiToken);
			}
		}
	},
	/**
	 * Delete selected API access from database if user is auhorized.
	 * @param {String} id - Database id of the api access token to be deleted
	 */
	deleteAPIAccess: function (apiAccessId) {
		check(apiAccessId, String);

		if (!Roles.userIsInRole(this.userId, ['admin'])) {
			throw new Meteor.Error("not-authorized");
		} else {
			APIAccess.remove(apiAccessId);
		}
	}
});
