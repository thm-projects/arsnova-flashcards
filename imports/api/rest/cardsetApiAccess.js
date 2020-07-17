import {Meteor} from "meteor/meteor";
import {APIAccess} from "../subscriptions/cardsetApiAccess";
import {JsonRoutes} from "meteor/simple:json-routes";
import {Cards} from "../subscriptions/cards.js";
import {Cardsets} from "../subscriptions/cardsets.js";
import {mongoReplacementModifier} from "../../util/cardsetApiAccess";

if (Meteor.isServer) {
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
			var cardsetCards = Cards.find({cardset_id: id}, {fields: {_id: 1}}).fetch().map((c) => c._id);

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
					quantity: retCards.length,
					dateUpdated: new Date()
				}
			});

			JsonRoutes.sendResult(res, {
				data: JSON.stringify(retCards)
			});
		}
	});
}
