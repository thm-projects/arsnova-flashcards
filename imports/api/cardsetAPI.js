import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {JsonRoutes} from "meteor/simple:json-routes";
import {Cards} from "./cards.js";

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

JsonRoutes.add("post", "/cardsets/:id", function (req, res) {
	var id = req.params.id;
	var token = req.params.token;

	var at = APIAccess.findOne({cardset_id: id, token: token});

	if (!at) {
		JsonRoutes.sendResult(res, {
			data: "permission denied"
		});
	} else {
		var cards = req.body;

		cards.forEach(function (card) {
			card.cardset_id = id;
			if (card._id != null && card._id !== "") {
				var oldCard = Cards.findOne({_id: card._id});
				var modifier = mongoReplacementModifier(card, oldCard);
				Cards.update(card._id, modifier);
			} else {
				Cards.insert(card);
			}
		});

		JsonRoutes.sendResult(res, {
			data: "success"
		});
	}
});

var APIAccessSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	token: {
		type: String
	}
});

APIAccess.attachSchema(APIAccessSchema);
