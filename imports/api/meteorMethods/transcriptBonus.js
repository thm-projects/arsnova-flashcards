import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Cardsets} from "../subscriptions/cardsets";
import {TranscriptBonus} from "../subscriptions/transcriptBonus";
import {UserPermissions} from "../../util/permissions";
import {TranscriptBonusList} from "../../util/transcriptBonus";

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
						date: cardset.transcriptBonus.lectures[date_id].date,
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
				content += TranscriptBonusList.getStarsData(cardset_id, users[i]._id, 1) + colSep;
				content += TranscriptBonusList.getStarsData(cardset_id, users[i]._id, 0) + colSep;
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
