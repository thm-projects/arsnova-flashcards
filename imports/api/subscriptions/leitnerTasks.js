import {Mongo} from "meteor/mongo";

export const LeitnerTasks = new Mongo.Collection("leitnerTasks");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetTask", function (cardset_id) {
		if (Meteor.userId()) {
			return LeitnerTasks.find({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, limit: 1});
		} else {
			this.ready();
		}
	});
}
