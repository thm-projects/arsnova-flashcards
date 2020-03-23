import {Meteor} from "meteor/meteor";
import {Leitner} from "./subscriptions/leitner";
import {Workload} from "./subscriptions/workload";
import {Cardsets} from "./subscriptions/cardsets.js";
import {check} from "meteor/check";
import {getAuthorName} from "./userdata";
import {Profile} from "./profile";
import {Bonus} from "./bonus";
import {ServerStyle} from "./styles";
import * as config from "../config/bonusForm.js";
import {LeitnerHistory} from "./subscriptions/leitnerHistory";
import {Utilities} from "./utilities";
import {UserPermissions} from "./permissions";

function getLearningStatus(learningEnd) {
	if (learningEnd.getTime() > new Date().getTime()) {
		return TAPi18n.__('set-list.activeLearnphase', {}, ServerStyle.getClientLanguage());
	} else {
		return TAPi18n.__('set-list.inactiveLearnphase', {}, ServerStyle.getClientLanguage());
	}
}

function getCardsetInfo(cardset) {
	return [
		[TAPi18n.__('set-list.cardsetInfoStatic', {}, ServerStyle.getClientLanguage()), ""],
		[TAPi18n.__('set-list.name', {}, ServerStyle.getClientLanguage()), cardset.name],
		[TAPi18n.__('modal-dialog.kind', {}, ServerStyle.getClientLanguage()), cardset.kind],
		[TAPi18n.__('cardset.info.rating', {}, ServerStyle.getClientLanguage()), cardset.rating],
		[TAPi18n.__('cardset.info.quantity', {}, ServerStyle.getClientLanguage()), cardset.quantity],
		[TAPi18n.__('cardset.info.author', {}, ServerStyle.getClientLanguage()), getAuthorName(cardset.owner)],
		[TAPi18n.__('cardset.info.release', {}, ServerStyle.getClientLanguage()), moment(cardset.date).locale(ServerStyle.getClientLanguage()).format('LL')],
		[TAPi18n.__('cardset.info.dateUpdated', {}, ServerStyle.getClientLanguage()), moment(cardset.dateUpdated).locale(ServerStyle.getClientLanguage()).format('LL')]
	];
}

function getCurrentMaxBonusPoints(cardset) {
	if (cardset.workload.bonus.maxPoints === undefined) {
		return config.defaultMaxBonusPoints;
	} else {
		return cardset.workload.bonus.maxPoints;
	}
}

function getCurrentMinLearned(cardset) {
	if (cardset.workload.bonus.minLearned === undefined) {
		return config.defaultMinLearned;
	} else {
		return cardset.workload.bonus.minLearned;
	}
}

function getLearningPhaseInfo(cardset) {
	return [
		["", ""],
		[TAPi18n.__('set-list.learnphaseInfo', {}, ServerStyle.getClientLanguage()), ""],
		[TAPi18n.__('set-list.learnphase', {}, ServerStyle.getClientLanguage()), getLearningStatus(cardset.learningEnd)],
		[TAPi18n.__('cardset.info.workload.bonus.count', {}, ServerStyle.getClientLanguage()), cardset.workload.bonus.count],
		[TAPi18n.__('set-list.bonusMaxPoints.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMaxPoints.content', {count: getCurrentMaxBonusPoints(cardset)}, ServerStyle.getClientLanguage())],
		[TAPi18n.__('set-list.bonusMin.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMin.content', {count: getCurrentMinLearned(cardset)}, ServerStyle.getClientLanguage())],
		[TAPi18n.__('bonus.form.maxWorkload.label', {}, ServerStyle.getClientLanguage()), cardset.maxCards],
		[TAPi18n.__('bonus.form.daysBeforeReset.label', {}, ServerStyle.getClientLanguage()), cardset.daysBeforeReset],
		[TAPi18n.__('bonus.form.startDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningStart).locale(ServerStyle.getClientLanguage()).format('LL')],
		[TAPi18n.__('bonus.form.endDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningEnd).locale(ServerStyle.getClientLanguage()).format('LL')],
		[TAPi18n.__('bonus.form.registrationPeriod.label', {}, ServerStyle.getClientLanguage()), moment(cardset.registrationPeriod).locale(ServerStyle.getClientLanguage()).format('LL')]
	];
}

function sortByBirthname(data) {
	data.sort(function (a, b) {
		let nameA = a.birthname.toUpperCase(); // ignore upper and lowercase
		let nameB = b.birthname.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}

		// names must be equal
		return 0;
	});
	return data;
}

export function getLearners(data, cardset_id) {
	let learningDataArray = [];
	for (let i = 0; i < data.length; i++) {
		let user = Meteor.users.find({_id: data[i].user_id}).fetch();

		let filter = [];
		for (let l = 1; l <= 6; l++) {
			filter.push({
				cardset_id: cardset_id,
				user_id: data[i].user_id,
				box: l
			});
		}

		if (user[0].profile.name !== undefined && !Profile.isCompleted(user[0])) {
			user[0].profile.birthname = user[0].profile.name;
			user[0].profile.givenname = TAPi18n.__('leitnerProgress.user.missingName', {}, ServerStyle.getClientLanguage());
			user[0].email = "";
		}
		let lastActivity = data[i].leitner.dateJoinedBonus;
		let lastHistoryItem = LeitnerHistory.findOne({
			cardset_id: cardset_id,
			user_id: data[i].user_id,
			answer: {$exists: true}},
			{sort: {"timestamps.submission": -1}, fields: {_id: 1, timestamps: 1}});
		if (lastHistoryItem !== undefined && lastHistoryItem.timestamps !== undefined) {
			lastActivity = lastHistoryItem.timestamps.submission;
		}
		if (user[0].profile.name !== undefined) {
			learningDataArray.push({
				user_id: user[0]._id,
				birthname: user[0].profile.birthname,
				givenname: user[0].profile.givenname,
				email: user[0].email,
				box1: Leitner.find(filter[0]).count(),
				box2: Leitner.find(filter[1]).count(),
				box3: Leitner.find(filter[2]).count(),
				box4: Leitner.find(filter[3]).count(),
				box5: Leitner.find(filter[4]).count(),
				box6: Leitner.find(filter[5]).count(),
				mailNotification: user[0].mailNotification,
				webNotification: user[0].webNotification,
				dateJoinedBonus: data[i].leitner.dateJoinedBonus,
				lastActivity: lastActivity
			});
		}
	}
	return sortByBirthname(learningDataArray);
}

Meteor.methods({
	getCSVExport: function (cardset_id, header) {
		check(cardset_id, String);
		check(header, [String]);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let cardsetInfo = getCardsetInfo(cardset);
		let learningPhaseInfo = getLearningPhaseInfo(cardset);
		if (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			let content;
			let colSep = ";"; // Separates columns
			let infoCol = ";;;;;;;;;;;;;;"; // Separates columns
			let newLine = "\r\n"; //Adds a new line
			let infoCardsetCounter = 0;
			let infoCardsetLength = 6;
			let infoLearningPhaseCounter = 0;
			let infoLearningPhaseLength = 10;
			content = header[6] + colSep + header[7] + colSep + header[8] + colSep + header[10] + colSep + header[11] + colSep + header[12] + colSep;
			for (let i = 0; i <= 4; i++) {
				content += header[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += header[5] + colSep + header[9] + colSep + colSep + cardsetInfo[infoCardsetCounter++][0] + newLine;
			let learners = getLearners(Workload.find({cardset_id: cardset_id, 'leitner.bonus': true}).fetch(), cardset_id);
			for (let k = 0; k < learners.length; k++) {
				let totalCards = learners[k].box1 + learners[k].box2 + learners[k].box3 + learners[k].box4 + learners[k].box5 + learners[k].box6;
				let achievedBonus = Bonus.getAchievedBonus(learners[k].box6, cardset.workload, totalCards);
				if (achievedBonus > 0) {
					achievedBonus += " %";
				} else {
					achievedBonus = "0 %";
				}
				let box6 = learners[k].box6;
				let percentage = Math.round(box6 / totalCards * 100);
				if (percentage > 0) {
					box6 += " [" + percentage + " %]";
				}
				content += learners[k].birthname + colSep + learners[k].givenname + colSep + learners[k].email + colSep + Bonus.getNotificationStatus(learners[k], true) + colSep;
				content += Utilities.getMomentsDate(learners[k].dateJoinedBonus, false, 0, false) + colSep + Utilities.getMomentsDate(learners[k].lastActivity, false, 0, false) + colSep;
				content += learners[k].box1 + colSep + learners[k].box2 + colSep + learners[k].box3 + colSep + learners[k].box4 + colSep + learners[k].box5 + colSep + box6 +  colSep + achievedBonus +  colSep;
				if (infoCardsetCounter <= infoCardsetLength) {
					content += colSep + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1];
				} else if (infoLearningPhaseCounter <= infoLearningPhaseLength) {
					content += colSep + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1];
				}
				content += newLine;
			}
			while (infoCardsetCounter <= infoCardsetLength) {
				content += infoCol + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1] + newLine;
			}
			while (infoLearningPhaseCounter <= infoLearningPhaseLength) {
				content += infoCol + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1] + newLine;
			}
			return content;
		}
	},
	getLearningData: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			return getLearners(Workload.find({cardset_id: cardset_id, 'leitner.bonus': true}).fetch(), cardset_id);
		}
	},
	getLearningHistoryData: function (user_id, cardset_id) {
		check(user_id, String);
		check(cardset_id, String);

		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			let workload = Workload.findOne({user_id: user_id, cardset_id: cardset_id});
			let result = [];
			if (workload.leitner !== undefined && workload.leitner.tasks !== undefined) {
				for (let i = workload.leitner.tasks.length - 1; i >= 0; i--) {
					let item = {};
					item.date = workload.leitner.tasks[i];
					item.workload = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: i}).count();
					item.known = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: i, answer: 0}).count();
					item.notKnown = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: i, answer: 1}).count();
					if (LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: (i - 1), missedDeadline: true}).count() === 0) {
						item.reason = 0;
					} else {
						item.reason = 1;
					}
					let lastAnswerDate = LeitnerHistory.findOne({
						user_id: user_id,
						cardset_id: cardset_id,
						task_id: i,
						answer: {$exists: true}
					}, {fields: {timestamps: 1}, sort: {"timestamps.submission": -1}});
					if (lastAnswerDate !== undefined && lastAnswerDate.timestamps !== undefined) {
						item.lastAnswerDate = lastAnswerDate.timestamps.submission;
					}
					item.missedDeadline = false;
					let foundReset = LeitnerHistory.findOne({user_id: user_id, cardset_id: cardset_id, task_id: i, missedDeadline: true});
					if (foundReset !== undefined) {
						item.missedDeadline = true;
					}
					result.push(item);
				}
			}
			return result;
		}
	},
	getEditors: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let editorsDataArray = [];
		if (Meteor.userId() === cardset.owner || Roles.userIsInRole(Meteor.userId(), ["admin", "editor"])) {
			let editors = Meteor.users.find({
				_id: {$ne: cardset.owner},
				roles: {$nin: ['admin', 'editor'],$in: ['lecturer']}
			}).fetch();
			for (let i = 0; i < editors.length; i++) {
				editorsDataArray.push({
					givenname: editors[i].profile.givenname,
					birthname: editors[i].profile.birthname,
					roles: editors[i].roles,
					id: editors[i]._id
				});
			}
		}
		return editorsDataArray;
	},
	addEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$push: {editors: user_id}
				});
		}
		Leitner.remove({
			cardset_id: cardset._id,
			user_id: user_id
		});
		Meteor.call("updateLearnerCount", cardset._id);
	},
	removeEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: user_id}
				});
		}
	},
	leaveEditors: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset.editors.includes(Meteor.userId())) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: Meteor.userId()}
				});
		}
	},
	getWordcloudUserName: function (owner_id) {
		if (Cardsets.findOne({owner: owner_id, wordcloud: true, visible: true})) {
			return Meteor.users.findOne({_id: owner_id}, {
				fields: {
					"profile.title": 1,
					"profile.givenname": 1,
					"profile.birthname": 1
				}
			});
		}
	}
});
