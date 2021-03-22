import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";

export const LeitnerCardStats = new Mongo.Collection("leitnerCardStats");

if (Meteor.isServer) {
	Meteor.publish("cardsetLeitner", function (cardset_id) {
		if (this.userId) {
			return LeitnerCardStats.find({cardset_id: cardset_id, user_id: this.userId});
		} else {
			this.ready();
		}
	});
	Meteor.publish("userCardsetLeitner", function (cardset_id, user_id) {
		if (this.userId) {
			if (this.userId === user_id || Roles.userIsInRole(this.userId, [
				'admin',
				'editor',
				'lecturer'
			])) {
				return LeitnerCardStats.find({cardset_id: cardset_id, user_id: user_id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userLeitner", function () {
		if (this.userId) {
			return LeitnerCardStats.find({user_id: this.userId});
		} else {
			this.ready();
		}
	});
	Meteor.publish("allLeitner", function () {
		if (this.userId) {
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
				return LeitnerCardStats.find();
			}
		} else {
			this.ready();
		}
	});
}
