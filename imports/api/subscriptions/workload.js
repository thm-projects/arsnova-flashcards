import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";

export const Workload = new Mongo.Collection("workload");

if (Meteor.isServer) {
	Meteor.publish("cardsetWorkload", function (cardset_id) {
		if (this.userId) {
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor',
				'lecturer'
			])) {
				return Workload.find({
					cardset_id: cardset_id,
					$or: [
						{user_id: this.userId},
						{'leitner.bonus': true}
					]
				});
			} else {
				return Workload.find({
					cardset_id: cardset_id,
					user_id: this.userId
				});
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userWorkload", function () {
		if (this.userId) {
			return Workload.find({user_id: this.userId});
		} else {
			this.ready();
		}
	});
}
