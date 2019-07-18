import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {UserPermissions} from "./permissions";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {check} from "meteor/check";
import {Utilities} from "./utilities";
import * as config from "../config/transcriptBonus.js";
import * as icons from "../config/icons.js";

export const TranscriptBonus = new Mongo.Collection("transcriptBonus");

export let TranscriptBonusList = class TranscriptBonusList {
	static addLectureEndTime (transcriptBonus, date) {
		let hours = Number(transcriptBonus.lectureEnd.substring(0, 2));
		let minutes = Number(transcriptBonus.lectureEnd.substring(3, 5));
		return moment(date).add(hours, 'hours').add(minutes, 'minutes');
	}

	static getLatestExpiredDeadline (cardset_id) {
		let query = {cardset_id: cardset_id, rating: 0};
		let lastSubmission = TranscriptBonus.findOne(query, {sort: {date: -1}});
		if (lastSubmission !== undefined) {
			let hours = Number(lastSubmission.lectureEnd.substring(0, 2));
			let minutes = Number(lastSubmission.lectureEnd.substring(3, 5));
			return moment().add(hours, 'hours').add(minutes, 'minutes').subtract(lastSubmission.deadlineEditing, 'hours').toDate();
		} else {
			return undefined;
		}
	}

	static isDeadlineExpired (transcriptBonus, isEditingDeadline = false) {
		let deadline;
		if (isEditingDeadline) {
			deadline = transcriptBonus.deadlineEditing;
		} else {
			deadline = transcriptBonus.deadline;
		}
		return this.addLectureEndTime(transcriptBonus, transcriptBonus.date).add(deadline, 'hours') < new Date();
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

	static getLectureName (transcriptBonus, addLectureName = true) {
		let name = "";
		if (addLectureName) {
			name += transcriptBonus.name + ": ";
		}
		name += this.getLectureEnd(transcriptBonus, transcriptBonus.date, false);
		return name;
	}

	static getLectureEnd (transcriptBonus, date_id) {
		if (transcriptBonus.lectureEnd !== undefined) {
			let lectureEnd = this.addLectureEndTime(transcriptBonus, date_id);
			return TAPi18n.__('transcriptForm.lecture') + ": " + Utilities.getMomentsDate(lectureEnd, false);
		}
	}

	static getDeadline (transcriptBonus, date_id) {
		if (transcriptBonus.lectureEnd !== undefined) {
			let deadline = this.addLectureEndTime(transcriptBonus, date_id);
			deadline.add(transcriptBonus.deadline, 'hours');
			return TAPi18n.__('transcriptForm.deadline.submission') + ": " + Utilities.getMomentsDate(deadline, true, 1);
		}
	}

	static getDeadlineEditing (transcriptBonus, date_id, displayMode = 0) {
		if (transcriptBonus.lectureEnd !== undefined) {
			let deadlineEditing = this.addLectureEndTime(transcriptBonus, date_id);
			deadlineEditing.add(transcriptBonus.deadlineEditing, 'hours');
			switch (displayMode) {
				case 0:
					return TAPi18n.__('transcriptForm.deadline.editing') + ": " + Utilities.getMomentsDate(deadlineEditing, true, 1);
				case 1:
					return Utilities.getMomentsDate(deadlineEditing, true, 2, false);
				case 2:
					return Utilities.getMomentsDate(deadlineEditing, true, 1);
			}
		}
	}

	static transformMedian (median) {
		if (isNaN(median)) {
			return 0;
		}
		if (config.roundTheMedian) {
			return Math.round(median);
		} else {
			return median.toFixed(1);
		}
	}

	static getAchievedBonus (cardset_id, user_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {transcriptBonus: 1}});
		if (cardset !== undefined) {
			let query = {cardset_id: cardset_id, user_id: user_id, rating: 1};
			let acceptedTranscripts = TranscriptBonus.find(query).count();
			if (acceptedTranscripts === 0 || cardset.transcriptBonus.minimumSubmissions === 0) {
				return 0;
			} else {
				return Math.trunc((acceptedTranscripts / cardset.transcriptBonus.minimumSubmissions) * cardset.transcriptBonus.percentage);
			}
		}
	}

	static getBonusTranscriptRating (type = 0) {
		switch (type) {
			case 1:
				return icons.transcriptIcons.ratingAccepted;
			case 2:
				return icons.transcriptIcons.ratingDenied;
			default:
				return icons.transcriptIcons.ratingPending;
		}
	}

	static getSubmissions (cardset_id, user_id, rating) {
		let query = {cardset_id: cardset_id, user_id: user_id};
		if (rating !== undefined) {
			query.rating = rating;
		}
		return TranscriptBonus.find(query).count();
	}

	static getStarsTotal (cardset_id, user_id, rating) {
		let query = {cardset_id: cardset_id, user_id: user_id};
		query.rating = rating;
		if (query.stars !== undefined) {
			delete query.stars;
		}
		let transcripts = TranscriptBonus.find(query, {fields: {stars: 1}}).fetch();
		let stars = 0;
		for (let i = 0; i < transcripts.length; i++) {
			stars += transcripts[i].stars;
		}
		return stars;
	}

	static getBonusTranscriptTooltip (type = 0) {
		switch (type) {
			case 1:
				return TAPi18n.__('cardset.transcriptBonusRating.tooltip.accepted');
			case 2:
				return TAPi18n.__('cardset.transcriptBonusRating.tooltip.denied');
			default:
				return TAPi18n.__('cardset.transcriptBonusRating.tooltip.pending');
		}
	}
};

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
	Meteor.publish("cardsetTranscriptBonusReview", function (cardset_id) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(cardset._id);
				return TranscriptBonus.find({cardset_id: cardset._id, date: {$lt: latestExpiredDeadline}, rating: 0});
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
						deadlineEditing: cardset.transcriptBonus.deadlineEditing,
						dateCreated: new Date(),
						rating: 0,
						stars: 0,
						reasons: []
					}
				});
			}
			Meteor.call('updateTranscriptBonusStats', cardset._id);
		}
	},
	updateTranscriptBonusStats: function (cardset_id) {
		if (Meteor.isServer) {
			check(cardset_id, String);
			let cardset = Cardsets.findOne({_id: cardset_id});
			if (cardset !== undefined && cardset.transcriptBonus !== undefined) {
				let bonusTranscripts = TranscriptBonus.find({cardset_id: cardset._id}).fetch();
				let submissions = TranscriptBonus.find({cardset_id: cardset._id}).count();
				let userFilter = [];
				for (let i = 0; i < bonusTranscripts.length; i++) {
					userFilter.push(bonusTranscripts[i].user_id);
				}
				let participants = Meteor.users.find({_id: {$in: userFilter}}).count();
				Cardsets.update({_id: cardset._id}, {
					$set: {
						'transcriptBonus.stats.submissions': submissions,
						'transcriptBonus.stats.participants': participants
					}
				});
			}
		}
	},
	getTranscriptCSVExport: function (cardset_id, header) {
		check(cardset_id, String);
		check(header, [String]);

		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (UserPermissions.isOwner(cardset.owner) || cardset.editors.includes(Meteor.userId()))) {
			let content;
			let colSep = ";"; // Separates columns
			let newLine = "\r\n"; //Adds a new line
			content = "";
			for (let i = 0; i < header.length; i++) {
				content += header[i] + colSep;
			}
			content += newLine;
			let transcriptUsers = _.uniq(TranscriptBonus.find({cardset_id: cardset_id}, {
				fields: {user_id: 1}
			}).fetch().map(function (x) {
				return x.user_id;
			}), true);
			let users = Meteor.users.find({_id: {$in: transcriptUsers}}, {
				sort: {'profile.birthname': 1, 'profile.givenname': 1}, fields: {_id: 1, email: 1, profile: 1}
			}).fetch();
			for (let i = 0; i < users.length; i++) {
				content += users[i].profile.birthname + colSep;
				content += users[i].profile.givenname + colSep;
				content += users[i].email + colSep;
				content += TranscriptBonusList.getSubmissions(cardset_id, users[i]._id, undefined) + colSep;
				content += TranscriptBonusList.getSubmissions(cardset_id, users[i]._id, 0) + colSep;
				content += TranscriptBonusList.getSubmissions(cardset_id, users[i]._id, 1) + colSep;
				content += TranscriptBonusList.getSubmissions(cardset_id, users[i]._id, 2) + colSep;
				content += TranscriptBonusList.getAchievedBonus(cardset_id, users[i]._id) + " %" + colSep;
				content += newLine;
			}
			return content;
		}
	},
	rateTranscript: function (cardset_id, card_id, answer, ratingData) {
		check(cardset_id, String);
		check(card_id, String);
		check(answer, Boolean);
		check(ratingData, [Number]);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (UserPermissions.isOwner(cardset.owner) || cardset.editors.includes(Meteor.userId()))) {
			let rating;
			let stars;
			let reasons;
			switch (answer) {
				case true:
					rating = 1;
					stars = ratingData[0];
					reasons = [];
					break;
				case false:
					rating = 2;
					stars = 0;
					reasons = ratingData;
					break;
			}
			TranscriptBonus.update({cardset_id: cardset_id, card_id: card_id}, {
				$set: {
					rating: rating,
					reasons: reasons,
					stars: stars
				}
			});
		}
	}
});
