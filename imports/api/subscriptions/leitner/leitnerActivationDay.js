import {Mongo} from "meteor/mongo";

export const LeitnerActivationDay = new Mongo.Collection("leitnerActivationDay");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetTask", function (cardset_id) {
		if (Meteor.userId()) {
			return LeitnerActivationDay.find({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, limit: 1});
		} else {
			this.ready();
		}
	});
}
