import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {Cardsets} from "../subscriptions/cardsets.js";
import {Cards} from "../subscriptions/cards";
import {check} from "meteor/check";
import {Bonus} from "../../util/bonus";
import {LeitnerPerformanceHistory} from "../subscriptions/leitner/leitnerPerformanceHistory";
import {Utilities} from "../../util/utilities";
import {UserPermissions} from "../../util/permissions";
import {LeitnerActivationDay} from "../subscriptions/leitner/leitnerActivationDay";
import {CardsetUserlist} from "../../util/cardsetUserlist";
import {LeitnerLearningPhaseUtilities} from "../../util/learningPhase";

Meteor.methods({

	getLearningStatisticsCSVExport: function (cardset_id, learning_phase_id, header) {
		check(cardset_id, String);
		check(learning_phase_id, String);
		check(header[0], [String]);
		check(header[1], [String]);

		let content;
		let cardset = Cardsets.findOne({_id: cardset_id});
		let cardsetInfo = CardsetUserlist.getCardsetInfo(cardset);
		let learningPhaseInfo = CardsetUserlist.getLearningPhaseInfo(cardset);
		if (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			let learningPhase = LeitnerLearningPhaseUtilities.getLearningPhase(learning_phase_id);
			if (learningPhase.isBonus && learningPhase.cardset_id === cardset._id) {
				let colSep = ";"; // Separates columns
				let infoCol = ""; // Separates columns
				for (let i = 0; i < header.length + 1; i++) {
					infoCol += colSep;
				}
				let newLine = "\r\n"; //Adds a new line
				let infoCardsetCounter = 0;
				let infoCardsetLength = cardsetInfo.length - 1;
				let infoLearningPhaseCounter = 0;
				let infoLearningPhaseLength = learningPhaseInfo.length - 1;
				content = "";
				for (let i = 0; i <= header.length - 1; i++) {
					switch (header[i][1]) {
						case "box1":
							content += `${header[i][0]} [${learningPhase.intervals[0]}]`;
							break;
						case "box2":
							content += `${header[i][0]} [${learningPhase.intervals[1]}]`;
							break;
						case "box3":
							content += `${header[i][0]} [${learningPhase.intervals[2]}]`;
							break;
						case "box4":
							content += `${header[i][0]} [${learningPhase.intervals[3]}]`;
							break;
						case "box5":
							content += `${header[i][0]} [${learningPhase.intervals[4]}]`;
							break;
						default:
							content += header[i][0];
					}
					content += colSep;
				}
				content += colSep + cardsetInfo[infoCardsetCounter++][0] + newLine;
				let learners = CardsetUserlist.getLearners(LeitnerLearningWorkload.find({learning_phase_id: learningPhase._id, isBonus: true}).fetch(), cardset_id, learning_phase_id);
				for (let k = 0; k < learners.length; k++) {
					let totalCards = learners[k].box1 + learners[k].box2 + learners[k].box3 + learners[k].box4 + learners[k].box5 + learners[k].box6;
					let achievedBonus = Bonus.getAchievedBonus(learners[k].box6, LeitnerLearningPhaseUtilities.getActiveBonus(cardset._id).bonusPoints, totalCards);
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
					for (let i = 0; i <= header.length - 1; i++) {
						switch (header[i][1]) {
							case "lastName":
								content += learners[k].birthname;
								break;
							case "firstName":
								content += learners[k].givenname;
								break;
							case "email":
								content += learners[k].email;
								break;
							case "notifications":
								content += Bonus.getNotificationStatus(learners[k], true);
								break;
							case "dateJoined":
								content += Utilities.getMomentsDate(learners[k].dateJoinedBonus, false, 0, false);
								break;
							case "lastActivity":
								content += Utilities.getMomentsDate(learners[k].lastActivity, false, 0, false);
								break;
							case "workingTimeSum":
								content += Utilities.humanizeDuration(learners[k].workingTimeSum);
								break;
							case "workingTimeArithmeticMean":
								content += Utilities.humanizeDuration(learners[k].workingTimeArithmeticMean);
								break;
							case "workingTimeMedian":
								content += Utilities.humanizeDuration(learners[k].workingTimeMedian);
								break;
							case "workingTimeStandardDeviation":
								content += Utilities.humanizeDuration(learners[k].workingTimeStandardDeviation);
								break;
							case "answerTimeArithmeticMean":
								content += Utilities.humanizeDuration(learners[k].cardArithmeticMean);
								break;
							case "answerTimeMedian":
								content += Utilities.humanizeDuration(learners[k].cardMedian);
								break;
							case "answerTimeStandardDeviation":
								content += Utilities.humanizeDuration(learners[k].cardStandardDeviation);
								break;
							case "box1":
								content += learners[k].box1;
								break;
							case "box2":
								content += learners[k].box2;
								break;
							case "box3":
								content += learners[k].box3;
								break;
							case "box4":
								content += learners[k].box4;
								break;
							case "box5":
								content += learners[k].box5;
								break;
							case "learned":
								content += box6;
								break;
							case "achievedBonus":
								content += achievedBonus;
								break;
							default:
								content += "";
						}
						content += colSep;
					}
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
			}
			return content;
		}
	},
	getLearningStatistics: function (cardset_id, learning_phase_id) {
		check(cardset_id, String);
		check(learning_phase_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			return CardsetUserlist.getLearners(LeitnerLearningWorkload.find({learning_phase_id: learning_phase_id, isBonus: true}).fetch(), cardset_id, learning_phase_id);
		}
	},
	getLearningLog: function (user_id, cardset_id, activation_day_id, workload_id) {
		check(user_id, String);
		check(cardset_id, String);
		check(activation_day_id, String);
		check(workload_id, String);

		let newUserId;
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			newUserId = user_id;
		} else {
			newUserId = Meteor.userId();
		}

		let leitnerHistory = LeitnerPerformanceHistory.find({
				activation_day_id: activation_day_id,
				cardset_id: cardset_id,
				workload_id: workload_id,
				user_id: newUserId, "timestamps.submission": {$exists: true}},
			{sort: {"timestamps.submission": 1}}).fetch();
		if (leitnerHistory !== undefined && leitnerHistory.length) {
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
		} else {
			return [];
		}
	},
	getLastLearningStatusActivity: function (user, cardset_id, workload_id, isProfileView) {
		check(user, String);
		check(cardset_id, String);
		check(workload_id, String);
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
			user_id: user_id,
			cardset_id: cardset_id
		};

		if (workload_id !== "null") {
			query.workload_id = workload_id;
		}

		let lastActivity = "null";
		query["timestamps.submission"] = {$exists: true};
		let leitnerHistory = LeitnerPerformanceHistory.findOne(query,
			{sort: {"timestamps.submission": -1}});
		if (leitnerHistory !== undefined) {
			lastActivity = leitnerHistory.timestamps.submission;
		}
		return lastActivity;
	},
	getLearningHistory: function (user, cardset_id, workload_id) {
		check(user, String);
		check(cardset_id, String);
		check(workload_id, String);

		let user_id;
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			user_id = user;
		} else {
			user_id = Meteor.userId();
		}

		let result = [];
		let workload = LeitnerLearningWorkload.findOne({_id: workload_id, user_id: user_id, cardset_id: cardset_id});
		if (workload !== undefined) {
			let leitnerHistory = LeitnerPerformanceHistory.findOne({
					workload_id: workload._id, "timestamps.submission": {$exists: true}},
				{sort: {"timestamps.submission": -1}});
			let lastActivity = "";
			if (leitnerHistory !== undefined) {
				lastActivity = leitnerHistory.timestamps.submission;
			}
			let isInBonus = false;
			let userCardMedian = 0;
			let userCardArithmeticMean = 0;
			let userCardStandardDeviation = 0;
			let userWorkingTimeMedian = 0;
			let userWorkingTimeArithmeticMean = 0;
			let userWorkingTimeStandardDeviation = 0;
			if (workload.performanceStats !== undefined) {
				isInBonus = workload.isBonus;
				userCardMedian = workload.performanceStats.answerTime.median;
				userCardArithmeticMean = workload.performanceStats.answerTime.arithmeticMean;
				userCardStandardDeviation = workload.performanceStats.answerTime.standardDeviation;
				userWorkingTimeMedian = workload.performanceStats.workingTime.median;
				userWorkingTimeArithmeticMean = workload.performanceStats.workingTime.arithmeticMean;
				userWorkingTimeStandardDeviation = workload.performanceStats.workingTime.standardDeviation;
			}
			let leitnerActivationDays = LeitnerActivationDay.find({
				workload_id: workload._id}, {sort: {createdAt: -1}}).fetch();
			for (let i = 0; i < leitnerActivationDays.length; i++) {
				let item = {};
				let missedLastDeadline;
				item.workload_id = workload._id;
				item.lastActivity = lastActivity;
				item.isInBonus = isInBonus;
				item.cardsetShuffled = cardset.shuffled;
				item.cardsetTitle = cardset.name;
				item.createdAt = leitnerActivationDays[i].createdAt;
				item.userCardMedian = userCardMedian;
				item.userCardArithmeticMean = userCardArithmeticMean;
				item.userCardStandardDeviation = userCardStandardDeviation;
				item.userWorkingTimeMedian = userWorkingTimeMedian;
				item.userWorkingTimeArithmeticMean = userWorkingTimeArithmeticMean;
				item.userWorkingTimeStandardDeviation = userWorkingTimeStandardDeviation;
				if (leitnerActivationDays[i].performanceStats !== undefined) {
					item.cardMedian = leitnerActivationDays[i].performanceStats.answerTime.median;
					item.cardArithmeticMean = leitnerActivationDays[i].performanceStats.answerTime.arithmeticMean;
					item.cardStandardDeviation = leitnerActivationDays[i].performanceStats.answerTime.standardDeviation;
				} else {
					item.cardMedian = 0;
					item.cardArithmeticMean = 0;
					item.cardStandardDeviation = 0;
				}
				item.workload = LeitnerPerformanceHistory.find({
					user_id: user_id,
					cardset_id: cardset_id,
					activation_day_id: leitnerActivationDays[i]._id}).count();
				item.known = LeitnerPerformanceHistory.find({user_id: user_id,
					cardset_id: cardset_id,
					activation_day_id: leitnerActivationDays[i]._id, answer: 0}).count();
				item.notKnown = LeitnerPerformanceHistory.find({user_id: user_id,
					cardset_id: cardset_id,
					activation_day_id: leitnerActivationDays[i]._id, answer: 1}).count();
				item.missedDeadline = leitnerActivationDays[i].missedDeadline;
				item.user_id = user_id;
				item.cardset_id = cardset_id;
				item.activation_day_id = leitnerActivationDays[i]._id;
				if (i < leitnerActivationDays.length - 1) {
					missedLastDeadline = leitnerActivationDays[i + 1].missedDeadline;
				} else {
					missedLastDeadline = false;
				}
				if (missedLastDeadline) {
					item.reason = 1;
				} else {
					item.reason = 0;
				}
				let lastAnswerDate = LeitnerPerformanceHistory.findOne({
					user_id: user_id,
					cardset_id: cardset_id,
					activation_day_id: leitnerActivationDays[i]._id,
					answer: {$exists: true}
				}, {fields: {timestamps: 1}, sort: {"timestamps.submission": -1}});
				if (lastAnswerDate !== undefined && lastAnswerDate.timestamps !== undefined) {
					item.lastActivity = lastAnswerDate.timestamps.submission;
				}
				item.duration = 0;
				let performanceHistory = LeitnerPerformanceHistory.find({
					user_id: user_id,
					cardset_id: cardset_id,
					activation_day_id: leitnerActivationDays[i]._id,
					answer: {$exists: true}}, {fields: {timestamps: 1}}).fetch();
				if (performanceHistory !== undefined) {
					for (let h = 0; h < performanceHistory.length; h++) {
						let submission =  moment(performanceHistory[h].timestamps.submission);
						let question = moment(performanceHistory[h].timestamps.question);
						let duration = submission.diff(question);
						item.duration += moment(duration).valueOf();
					}
				}
				result.push(item);
			}
		}
		return result;
	}
});
