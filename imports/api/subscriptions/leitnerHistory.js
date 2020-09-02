import {Mongo} from "meteor/mongo";
import {LeitnerTasks} from "./leitnerTasks";

export const LeitnerHistory = new Mongo.Collection("leitnerHistory");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetHistory", function (cardset_id) {
		if (Meteor.userId()) {
			let task = LeitnerTasks.findOne({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, fields: {_id: 1}});
			if (task !== undefined) {
				return LeitnerHistory.find({cardset_id: cardset_id, user_id: Meteor.userId(), task_id: task._id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
}
