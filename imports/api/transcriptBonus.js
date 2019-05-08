import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {UserPermissions} from "./permissions";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {check} from "meteor/check";
import {Utilities} from "./utilities";

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
	}
});

TranscriptBonus.attachSchema(TranscriptBonusSchema);

Meteor.methods({
	addTranscriptBonus: function (card_id, cardset_id, user_id, date_id) {
		if (Meteor.isServer) {
			check(card_id, String);
			check(user_id, String);
			check(cardset_id, String);
			check(date_id, Number);
			let cardset = Cardsets.findOne({_id: cardset_id});

			if (cardset !== undefined) {
				TranscriptBonus.upsert({card_id: card_id}, {
					$set: {
						cardset_id: cardset._id,
						card_id: card_id,
						user_id: user_id,
						date: cardset.transcriptBonus.dates[date_id],
						lectureEnd: cardset.transcriptBonus.lectureEnd,
						deadline: cardset.transcriptBonus.deadline,
						dateCreated: new Date()
					}
				});
			}
		}
	}
});

export let TranscriptBonusList = class TranscriptBonusList {
	static addLectureEndTime (transcriptBonus, date) {
		let hours = Number(transcriptBonus.lectureEnd.substring(0, 2));
		let minutes = Number(transcriptBonus.lectureEnd.substring(3, 5));
		return moment(date).add(hours, 'hours').add(minutes, 'minutes');
	}

	static isDeadlineExpired (transcriptBonus) {
		return this.addLectureEndTime(transcriptBonus, transcriptBonus.date).add(transcriptBonus.deadline, 'hours') < new Date();
	}

	static canBeSubmittedToLecture (transcriptBonus, date_id) {
		if (transcriptBonus !== undefined && date_id !== undefined) {
			let cardset = Cardsets.findOne(transcriptBonus.cardset_id, {fields: {transcriptBonus: 1}});
			let startDate = this.addLectureEndTime(cardset.transcriptBonus, cardset.transcriptBonus.dates[date_id]);
			return cardset.transcriptBonus.enabled && startDate < new Date() && startDate.add(cardset.transcriptBonus.deadline, 'hours') > new Date();
		}
	}

	static checkForUpdate (card_id, user_id, transcriptBonusUser, transcriptBonusDatabase = undefined, date_id = undefined) {
		if (Meteor.isServer) {
			let transcriptBonusCardset = Cardsets.findOne(transcriptBonusUser.cardset_id);
			if (transcriptBonusDatabase !== undefined) {
				if (transcriptBonusUser.cardset_id !== transcriptBonusDatabase.cardset_id || transcriptBonusUser.date.getTime() !== transcriptBonusDatabase.date.getTime()) {
					if (this.canBeSubmittedToLecture(transcriptBonusUser, date_id)) {
						for (let i = 0; i < transcriptBonusCardset.transcriptBonus.dates.length; i++) {
							if (transcriptBonusCardset.transcriptBonus.dates[i].getTime() === transcriptBonusUser.date.getTime()) {
								date_id = i;
								break;
							}
						}
						if (date_id === undefined) {
							throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
						} else {
							Meteor.call("addTranscriptBonus", card_id, transcriptBonusCardset._id, Meteor.userId(), date_id);
						}
					} else {
						throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
					}
				}
			} else {
				Meteor.call("addTranscriptBonus", card_id, transcriptBonusUser.cardset_id, Meteor.userId(), date_id);
			}
		}
	}

	static getLectureName (transcriptBonus, isList = true, displayDeadline = true) {
		return transcriptBonus.name + ": " + this.getLectureInfo(transcriptBonus, transcriptBonus.date, isList, displayDeadline);
	}

	static getLectureInfo (transcriptBonus, date_id, isList = true, displayDeadline = true) {
		if (transcriptBonus.lectureEnd !== undefined) {
			let lectureEnd;
			if (isList) {
				lectureEnd = this.addLectureEndTime(transcriptBonus, transcriptBonus.dates[date_id]);
			} else {
				lectureEnd = this.addLectureEndTime(transcriptBonus, date_id);
			}
			let info = TAPi18n.__('transcriptForm.lecture') + ": " + Utilities.getMomentsDate(lectureEnd, false);
			if (displayDeadline) {
				info +=  ", " + TAPi18n.__('transcriptForm.deadline') + ": " + Utilities.getMomentsTime(lectureEnd) +  " " + TAPi18n.__('transcriptForm.until') + " " + Utilities.getMomentsDate(lectureEnd.add(transcriptBonus.deadline, 'hours'), true);
			}
			return info;
		}
	}
};