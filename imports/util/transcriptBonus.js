import {Meteor} from "meteor/meteor";
import {Cardsets} from "../api/subscriptions/cardsets";
import {TranscriptBonus} from "../api/subscriptions/transcriptBonus";
import {Utilities} from "./utilities";
import * as config from "../config/transcriptBonus.js";
import * as icons from "../config/icons.js";



export let TranscriptBonusList = class TranscriptBonusList {
	static getTranscriptLectureNameMaxLength () {
		return config.lectureNameMaxLength;
	}

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
			let startDate = this.addLectureEndTime(cardset.transcriptBonus, cardset.transcriptBonus.lectures[date_id].date);
			return cardset.transcriptBonus.enabled && startDate < new Date() && startDate.add(cardset.transcriptBonus.deadline, 'hours') > new Date();
		}
	}

	static checkForUpdate (card_id, user_id, transcriptBonusUser, transcriptBonusDatabase = undefined, date_id = undefined) {
		if (Meteor.isServer) {
			let transcriptBonusCardset = Cardsets.findOne(transcriptBonusUser.cardset_id);
			if (transcriptBonusDatabase !== undefined) {
				if (transcriptBonusUser.cardset_id !== transcriptBonusDatabase.cardset_id || transcriptBonusUser.date.getTime() !== transcriptBonusDatabase.date.getTime()) {
					if (this.canBeSubmittedToLecture(transcriptBonusUser, date_id)) {
						for (let i = 0; i < transcriptBonusCardset.transcriptBonus.lectures.length; i++) {
							if (transcriptBonusCardset.transcriptBonus.lectures[i].date.getTime() === transcriptBonusUser.date.getTime()) {
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

	static getLectureEnd (transcriptBonus, date) {
		if (transcriptBonus.lectureEnd !== undefined) {
			let lectureEnd = this.addLectureEndTime(transcriptBonus, date);
			let cardset = Cardsets.findOne({_id: transcriptBonus.cardset_id}, {fields: {transcriptBonus: 1}});
			let result = "";
			if (cardset !== undefined && cardset.transcriptBonus !== undefined) {
				for (let i = 0; i < cardset.transcriptBonus.lectures.length; i++) {
					if (cardset.transcriptBonus.lectures[i].date.getTime() === date.getTime()) {
						if (cardset.transcriptBonus.lectures[i].title !== undefined && cardset.transcriptBonus.lectures[i].title !== "") {
							result += cardset.transcriptBonus.lectures[i].title + " | ";
						}
					}
				}
			}
			return result += Utilities.getMomentsDate(lectureEnd, false);
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
			let acceptedTranscriptsTotal = TranscriptBonus.find(query).count();
			if (acceptedTranscriptsTotal === 0 || cardset.transcriptBonus.minimumSubmissions === 0) {
				return 0;
			} else {
				let acceptedTranscripts = TranscriptBonus.find(query).fetch();
				let finalScore = 0;
				let maxScorePerTranscript = cardset.transcriptBonus.percentage / cardset.transcriptBonus.minimumSubmissions;
				for (let i = 0; i < acceptedTranscripts.length; i++) {
					if (acceptedTranscripts[i].stars >= cardset.transcriptBonus.minimumStars) {
						finalScore += maxScorePerTranscript;
					} else {
						finalScore += (acceptedTranscripts[i].stars / cardset.transcriptBonus.minimumStars) * maxScorePerTranscript;
					}
				}
				finalScore = Math.round(finalScore);
				if (finalScore >= cardset.transcriptBonus.percentage) {
					return cardset.transcriptBonus.percentage;
				}
				return finalScore;
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

	static getStarsData (cardset_id, user_id, type) {
		let query = {cardset_id: cardset_id, user_id: user_id};
		query.rating = 1;
		if (query.stars !== undefined) {
			delete query.stars;
		}
		let transcripts = TranscriptBonus.find(query, {fields: {stars: 1}}).fetch();
		let stars = 0;
		for (let i = 0; i < transcripts.length; i++) {
			stars += transcripts[i].stars;
		}
		if (type === 1) {
			return stars;
		} else {
			if (stars === 0) {
				return 0;
			}
			let median = stars / transcripts.length;
			if (config.roundTheStarsMedian) {
				return Math.round(median);
			} else {
				median = (median).toString().replace('.', ',');
				if (median.length > 4) {
					return median.substr(0, 4);
				}
				return median;
			}
		}
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
