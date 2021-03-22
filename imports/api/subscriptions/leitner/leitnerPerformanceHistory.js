import {Mongo} from "meteor/mongo";
import {LeitnerActivationDay} from "./leitnerActivationDay";

export const LeitnerPerformanceHistory = new Mongo.Collection("leitnerPerformanceHistory");

if (Meteor.isServer) {
	Meteor.publish("latestLeitnerCardsetHistory", function (cardset_id) {
		if (Meteor.userId()) {
			let task = LeitnerActivationDay.findOne({cardset_id: cardset_id, user_id: Meteor.userId()}, {sort: {createdAt: -1, session: -1}, fields: {_id: 1}});
			if (task !== undefined) {
				return LeitnerPerformanceHistory.find({cardset_id: cardset_id, user_id: Meteor.userId(), task_id: task._id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
}
