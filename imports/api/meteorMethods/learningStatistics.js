import {Meteor} from "meteor/meteor";
import {Workload} from "../subscriptions/workload";
import {Cardsets} from "../subscriptions/cardsets.js";
import {Cards} from "../subscriptions/cards";
import {check} from "meteor/check";
import {Bonus} from "../../util/bonus";
import {LeitnerHistory} from "../subscriptions/leitnerHistory";
import {Utilities} from "../../util/utilities";
import {UserPermissions} from "../../util/permissions";
import {LeitnerTasks} from "../subscriptions/leitnerTasks";
import {LeitnerUtilities} from "../../util/leitner";
import {CardsetUserlist} from "../../util/cardsetUserlist";

Meteor.methods({
	getLearningStatisticsCSVExport: function (cardset_id, header) {
		check(cardset_id, String);
		check(header, [String]);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let cardsetInfo = CardsetUserlist.getCardsetInfo(cardset);
		let learningPhaseInfo = CardsetUserlist.getLearningPhaseInfo(cardset);
		if (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			let content;
			let colSep = ";"; // Separates columns
			let infoCol = ";;;;;;;;;;;;;;;;;"; // Separates columns
			let newLine = "\r\n"; //Adds a new line
			let infoCardsetCounter = 0;
			let infoCardsetLength = 6;
			let infoLearningPhaseCounter = 0;
			let infoLearningPhaseLength = 15;
			content = header[6] + colSep + header[7] + colSep + header[8] + colSep + header[10] + colSep + header[11] + colSep + header[12] + colSep + header[13] + colSep + header[14] + colSep + header[15] + colSep;
			for (let i = 0; i <= 4; i++) {
				content += header[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += header[5] + colSep + header[9] + colSep + colSep + cardsetInfo[infoCardsetCounter++][0] + newLine;
			let learners = CardsetUserlist.getLearners(Workload.find({cardset_id: cardset_id, 'leitner.bonus': true}).fetch(), cardset_id);
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
				content += Utilities.humanizeDuration(learners[k].cardArithmeticMean) + colSep + Utilities.humanizeDuration(learners[k].cardMedian) + colSep + Utilities.humanizeDuration(learners[k].cardStandardDeviation) + colSep;
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
	getLearningStatistics: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			return CardsetUserlist.getLearners(Workload.find({cardset_id: cardset_id, 'leitner.bonus': true}).fetch(), cardset_id);
		}
	},
	getLearningLog: function (user_id, cardset_id, task_id) {
		check(user_id, String);
		check(cardset_id, String);
		check(task_id, String);

		let newUserId;
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			newUserId = user_id;
		} else {
			newUserId = Meteor.userId();
		}

		let leitnerHistory = LeitnerHistory.find({task_id: task_id, cardset_id: cardset_id, user_id: newUserId, "timestamps.submission": {$exists: true}},
			{sort: {"timestamps.submission": 1}}).fetch();
		let cardIds = leitnerHistory.map(function (history) {
			return history.card_id;
		});
		let cards = Cards.find({_id: {$in: cardIds}},{fields:
				{
					_id: 1,
					subject: 1,
					cardset_id: 1,
					front: 1,
					back: 1,
					top: 1,
					bottom: 1,
					hint: 1,
					lecture: 1,
					"answers.question": 1,
					cardType: 1
				}}).fetch();
		for (let i = 0; i < leitnerHistory.length; i++) {
			for (let c = 0; c < cards.length; c++) {
				if (leitnerHistory[i].card_id === cards[c]._id) {
					leitnerHistory[i].cardData = cards[c];
					if (cards[c].answers !== undefined && cards[c].answers.question !== undefined) {
						leitnerHistory[i].cardData.question = cards[c].answers.question;
					} else {
						leitnerHistory[i].cardData.question = "";
					}
					break;
				}
			}
		}
		return leitnerHistory;
	},
	getLastLearningStatusActivity: function (user, cardset_id, isProfileView) {
		check(user, String);
		check(cardset_id, String);
		check(isProfileView, Boolean);

		let user_id;
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (isProfileView) {
			user_id = Meteor.userId();
		} else if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			user_id = user;
		} else {
			user_id = Meteor.userId();
		}

		let query = {
			user_id: user_id
		};

		let lastActivity = "null";
		if (!isProfileView) {
			query.cardset_id = cardset_id;
			let highestSessionTask = LeitnerTasks.findOne(query, {sort: {session: -1}});
			if (highestSessionTask === undefined) {
				return lastActivity;
			}
			query.session = highestSessionTask.session;
			let leitnerTasks = LeitnerTasks.find(query, {sort: {createdAt: -1}}).fetch();
			let taskIds = leitnerTasks.map(function (task) {
				return task._id;
			});
			delete query.session;
			query.task_id = {$in: taskIds};
		}
		query["timestamps.submission"] = {$exists: true};
		let leitnerHistory = LeitnerHistory.findOne(query,
			{sort: {"timestamps.submission": -1}});
		if (leitnerHistory !== undefined) {
			lastActivity = leitnerHistory.timestamps.submission;
		}
		return lastActivity;
	},
	getLearningHistory: function (user, cardset_id) {
		check(user, String);
		check(cardset_id, String);

		let user_id;
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			user_id = user;
		} else {
			user_id = Meteor.userId();
		}
		let highestSessionTask = LeitnerUtilities.getHighestLeitnerTaskSessionID(cardset_id, user_id);
		let leitnerTasks = LeitnerTasks.find({user_id: user_id, cardset_id: cardset_id, session: highestSessionTask.session}, {sort: {createdAt: -1}}).fetch();
		let taskIds = leitnerTasks.map(function (task) {
			return task._id;
		});
		let leitnerHistory = LeitnerHistory.findOne({task_id: {$in: taskIds}, cardset_id: cardset_id, user_id: user_id, "timestamps.submission": {$exists: true}},
			{sort: {"timestamps.submission": -1}});
		let lastActivity = "";
		if (leitnerHistory !== undefined) {
			lastActivity = leitnerHistory.timestamps.submission;
		}
		let result = [];
		let workload = Workload.findOne({user_id: user_id, cardset_id: cardset_id});
		let isInBonus = false;
		let userCardMedian = 0;
		let userCardArithmeticMean = 0;
		let userCardStandardDeviation = 0;
		if (workload !== undefined && workload.leitner.timelineStats !== undefined) {
			isInBonus = workload.leitner.bonus;
			userCardMedian = workload.leitner.timelineStats.median;
			userCardArithmeticMean = workload.leitner.timelineStats.arithmeticMean;
			userCardStandardDeviation = workload.leitner.timelineStats.standardDeviation;
		}
		for (let i = 0; i < leitnerTasks.length; i++) {
			let item = {};
			let missedLastDeadline;
			item.lastActivity = lastActivity;
			item.isInBonus = isInBonus;
			item.cardsetShuffled = cardset.shuffled;
			item.cardsetTitle = cardset.name;
			item.date = leitnerTasks[i].createdAt;
			item.userCardMedian = userCardMedian;
			item.userCardArithmeticMean = userCardArithmeticMean;
			item.userCardStandardDeviation = userCardStandardDeviation;
			if (leitnerTasks[i].timelineStats !== undefined) {
				item.cardMedian = leitnerTasks[i].timelineStats.median;
				item.cardArithmeticMean = leitnerTasks[i].timelineStats.arithmeticMean;
				item.cardStandardDeviation = leitnerTasks[i].timelineStats.standardDeviation;
			} else {
				item.cardMedian = 0;
				item.cardArithmeticMean = 0;
				item.cardStandardDeviation = 0;
			}
			item.workload = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: leitnerTasks[i]._id}).count();
			item.known = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: leitnerTasks[i]._id, answer: 0}).count();
			item.notKnown = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: leitnerTasks[i]._id, answer: 1}).count();
			item.missedDeadline = leitnerTasks[i].missedDeadline;
			item.user_id = user_id;
			item.cardset_id = cardset_id;
			item.task_id = leitnerTasks[i]._id;
			if (i < leitnerTasks.length - 1) {
				missedLastDeadline = leitnerTasks[i + 1].missedDeadline;
			} else {
				missedLastDeadline = false;
			}
			if (missedLastDeadline) {
				item.reason = 1;
			} else {
				item.reason = 0;
			}
			let lastAnswerDate = LeitnerHistory.findOne({
				user_id: user_id,
				cardset_id: cardset_id,
				task_id: leitnerTasks[i]._id,
				answer: {$exists: true}
			}, {fields: {timestamps: 1}, sort: {"timestamps.submission": -1}});
			if (lastAnswerDate !== undefined && lastAnswerDate.timestamps !== undefined) {
				item.lastAnswerDate = lastAnswerDate.timestamps.submission;
			}
			item.duration = 0;
			let history = LeitnerHistory.find({user_id: user_id, cardset_id: cardset_id, task_id: leitnerTasks[i]._id, answer: {$exists: true}}, {fields: {timestamps: 1}}).fetch();
			if (history !== undefined) {
				for (let h = 0; h < history.length; h++) {
					let submission =  moment(history[h].timestamps.submission);
					let question = moment(history[h].timestamps.question);
					let duration = submission.diff(question);
					item.duration += moment(duration).valueOf();
				}
			}
			result.push(item);
		}
		return result;
	}
});
