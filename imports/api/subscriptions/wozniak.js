import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";

export const Wozniak = new Mongo.Collection("wozniak");

if (Meteor.isServer) {
	Meteor.publish("cardsetWozniak", function (cardset_id) {
		if (this.userId) {
			return Wozniak.find({cardset_id: cardset_id, user_id: this.userId});
		} else {
			this.ready();
		}
	});
	Meteor.publish("userWozniak", function () {
		if (this.userId) {
			return Wozniak.find({user_id: this.userId});
		} else {
			this.ready();
		}
	});
}
