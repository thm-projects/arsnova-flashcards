import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {UserPermissions} from "../../util/permissions";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {TranscriptBonusList} from "../../util/transcriptBonus";

export const TranscriptBonus = new Mongo.Collection("transcriptBonus");


if (Meteor.isServer) {
	Meteor.publish("cardsetTranscriptBonus", function (cardset_id) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				return TranscriptBonus.find({cardset_id: cardset._id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetTranscriptMyBonus", function (card_id) {
		if (this.userId) {
			let card = TranscriptBonus.findOne({card_id: card_id}, {fields: {cardset_id: 1, _id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(card.owner)) {
				return Cardsets.find({_id: card.cardset_id});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("cardsetTranscriptBonusReview", function (cardset_id, filterID = undefined) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(cardset._id);
				let query = {cardset_id: cardset._id, date: {$lt: latestExpiredDeadline}, rating: 0};
				if (filterID !== undefined && filterID !== null) {
					query.card_id = filterID;
				}
				return TranscriptBonus.find(query);
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("myTranscriptBonus", function () {
		if (this.userId) {
			return TranscriptBonus.find({user_id: this.userId});
		} else {
			this.ready();
		}
	});
}

const TranscriptBonusSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	card_id: {
		type: String
	},
	user_id: {
		type: String
	},
	date: {
		type: Date
	},
	lectureEnd: {
		type: String
	},
	deadline: {
		type: Number
	},
	deadlineEditing: {
		type: Number
	},
	rating: {
		type: Number,
		optional: true
	},
	reasons: {
		type: [Number],
		optional: true
	},
	stars: {
		type: Number,
		optional: true
	}
});

TranscriptBonus.attachSchema(TranscriptBonusSchema);
