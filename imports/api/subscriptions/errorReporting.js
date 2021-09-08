import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {Cards} from "./cards";

export const ErrorReporting = new Mongo.Collection("errorReporting");

if (Meteor.isServer) {
	Meteor.publish("getErrorReport", function (error_report_id) {
		if (this.userId) {
			return ErrorReporting.find({error_report_id: error_report_id, user_id: this.userId});
		} else {
			this.ready();
		}
	});
	Meteor.publish("hasCardsetUnresolvedErrors", function (cardset_id) {
		if (this.userId) {
			return Cardsets.find({_id: cardset_id}).unresolvedErrors > 0;
		} else {
			this.ready();
		}
	});
	Meteor.publish("ownError", function () {
		if (this.userId) {
			const cards = Cards.find({owner: this.userId}, {"_id": 1}).fetch();
			const cardIds = [];
			for (const card of cards) {
				cardIds.push(card._id);
			}
			const cardSets = Cardsets.find({owner: this.userId}, {_id: 1}).fetch();
			const cardSetIds = [];
			for (const cardSet of cardSets) {
				cardSetIds.push(cardSet._id);
			}
			return ErrorReporting.find({status: 0, $or: [{card_id: {$in: cardIds}}, {cardset_id: {$in: cardSetIds}}]});
		} else {
			this.ready();
		}
	});
}
