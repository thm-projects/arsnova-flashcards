import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const LeitnerBonusCardStats = new Mongo.Collection("leitnerBonusCardStats");
export const LeitnerUserCardStats = new Mongo.Collection("leitnerUserCardStats");

if (Meteor.isServer) {
	Meteor.publish("cardsetLeitner", function (cardset_id) {
		if (this.userId) {
			return LeitnerUserCardStats.find({cardset_id: cardset_id, user_id: this.userId});
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
				return LeitnerUserCardStats.find({cardset_id: cardset_id, user_id: user_id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userLeitner", function () {
		if (this.userId) {
			return LeitnerUserCardStats.find({user_id: this.userId});
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
				return LeitnerUserCardStats.find();
			}
		} else {
			this.ready();
		}
	});
}

const LeitnerUserCardStatsSchema = new SimpleSchema({
	card_id: {
		type: String
	},
	cardset_id: {
		type: String
	},
	original_cardset_id: {
		type: String,
		optional: true
	},
	workload_id: {
		type: String
	},
	user_id: {
		type: String
	},
	learning_phase_id: {
		type: String
	},
	box: {
		type: Number,
		defaultValue: 1
	},
	isActive: {
		type: Boolean,
		defaultValue: true
	},
	nextPossibleActivationDate: {
		type: Date,
		defaultValue: new Date()
	},
	activatedSinceDate: {
		type: Date,
		defaultValue: new Date()
	},
	priority: {
		type: Number,
		defaultValue: 0
	},
	viewedPDF: {
		type: Boolean,
		defaultValue: false
	}
});

LeitnerUserCardStats.attachSchema(LeitnerUserCardStatsSchema);
