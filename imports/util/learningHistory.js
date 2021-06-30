import {Bonus} from "./bonus";
import {Session} from "meteor/session";
import {CardType, CardType as CardTypes} from "./cardTypes";
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/learningHistory";
import {Utilities} from "./utilities";
import {LeitnerLearningPhaseUtilities} from "./learningPhase";

export let LeitnerHistoryUtilities = class LearningHistory {
	static prepareCardStatsData (cardStats) {
		for (let i = 0; i < cardStats.length; i++) {
			let card = cardStats[i];

			//Set subject
			cardStats[i].cardSubject = card.cardData.subject;

			//Set percent
			let percent = (cardStats[i].stats.answers.known / (cardStats[i].stats.answers.known + cardStats[i].stats.answers.notKnown) * 100);
			if (isNaN(percent)) {
				percent = 0;
			}
			cardStats[i].percent = Math.floor(percent);

			//Set totalAnswers
			cardStats[i].totalAnswers = cardStats[i].stats.answers.known + cardStats[i].stats.answers.notKnown;

			//Set skipped answers
			cardStats[i].skipped = cardStats[i].stats.answers.skipped;

			//Set times
			cardStats[i].workingTimeSum = cardStats[i].stats.workingTime.sum;
			cardStats[i].workingTimeMedian = cardStats[i].stats.workingTime.median;
			cardStats[i].workingTimeArithmeticMean = cardStats[i].stats.workingTime.arithmeticMean;
			cardStats[i].workingTimeStandardDeviation = cardStats[i].stats.workingTime.standardDeviation;

			//Set cardType and cardType name
			cardStats[i].cardType = card.cardData.cardType;
			cardStats[i].cardTypeName = CardType.getCardTypeName(card.cardData.cardType);

			//Set card content
			if (CardTypes.gotNoSideContent(card.cardData.cardType)) {
				if (card.cardData.answers !== undefined && card.cardData.answers.question !== undefined) {
					cardStats[i].content = card.cardData.answers.question;
				} else {
					cardStats[i].content = "";
				}
			} else {
				let cubeSides = CardType.getCardTypeCubeSides(card.cardData.cardType);
				switch (cubeSides[0].contentId) {
					case 1:
						cardStats[i].content = card.cardData.front;
						break;
					case 2:
						cardStats[i].content = card.cardData.back;
						break;
					case 3:
						cardStats[i].content = card.cardData.hint;
						break;
					case 4:
						cardStats[i].content = card.cardData.lecture;
						break;
					case 5:
						cardStats[i].content = card.cardData.top;
						break;
					case 6:
						cardStats[i].content = card.cardData.bottom;
						break;
				}
			}
			let text = CardVisuals.removeMarkdeepTags(cardStats[i].content);
			if (text.length > config.maxTaskHistoryContentLength) {
				cardStats[i].content =  text.substr(0, config.maxTaskHistoryContentLength) +  '...';
			} else {
				cardStats[i].content =  text;
			}
			cardStats[i].cardSubject = `${cardStats[i].cardSubject}: ${cardStats[i].content}`;

			//Convert dates and time to readable format
			cardStats[i].workingTimeMedianString = Utilities.humanizeDuration(cardStats[i].workingTimeMedian);
			cardStats[i].workingTimeSumString = Utilities.humanizeDuration(cardStats[i].workingTimeSum);
		}
		return Utilities.sortArray(cardStats, config.defaultCardStatsSettings.content, config.defaultCardStatsSettings.desc);
	}

	static prepareBonusUserData (bonusUsers) {
		for (let i = 0; i < bonusUsers.length; i++) {
			let user = bonusUsers[i];
			//Set hidden username
			bonusUsers[i].placeholderID = i + 1;
			bonusUsers[i].placeholderName = TAPi18n.__('learningStatistics.hiddenUserPlaceholder', {index: i + 1}, "de");
			//Set bonus percentage
			let totalCards = user.box1 + user.box2 + user.box3 + user.box4 + user.box5 + user.box6;
			bonusUsers[i].percentage = Math.round(user.box6 / totalCards * 100);

			//Set achieved bonus
			bonusUsers[i].achievedBonus = Bonus.getAchievedBonus(user.box6, LeitnerLearningPhaseUtilities.getActiveBonus(Session.get('activeCardset')._id).bonusPoints, (user.box1 + user.box2 + user.box3 + user.box4 + user.box5 + user.box6));

			//Convert dates and time to readable format
			bonusUsers[i].dateJoinedBonusString = Utilities.getMomentsDate(bonusUsers[i].dateJoinedBonus);
			bonusUsers[i].lastActivityString = Utilities.getMomentsDate(bonusUsers[i].lastActivity);
			bonusUsers[i].workingTimeSumString = Utilities.humanizeDuration(bonusUsers[i].workingTimeSum);
			bonusUsers[i].cardArithmeticMeanString = Utilities.humanizeDuration(bonusUsers[i].cardArithmeticMean);
		}
		return Utilities.sortArray(bonusUsers, config.defaultBonusUserSortSettings.content, config.defaultBonusUserSortSettings.desc);
	}

	static prepareUserHistoryData (userHistory) {
		let completedPreviousWorkload = true;
		//Set status and reason for activation
		let latestActivationDate = userHistory[0];
		userHistory.reverse();
		for (let activationDate of userHistory) {
			if (completedPreviousWorkload) {
				activationDate.activationReasonText = TAPi18n.__('learningHistory.table.reason.leitner');
			} else {
				activationDate.activationReasonText = TAPi18n.__('learningHistory.table.reason.deadline');
			}
			let completedWorkload = activationDate.known + activationDate.notKnown;
			if (completedWorkload === activationDate.workload) {
				activationDate.statusCode = activationDate.lastActivity;
				activationDate.statusText = TAPi18n.__('learningHistory.table.status.completed', {lastAnswerDate: Utilities.getMomentsDate(activationDate.lastActivity, 0, false, false)});
				completedPreviousWorkload = true;
			} else {
				//Is this the newest element?
				if (latestActivationDate.createdAt === activationDate.createdAt && activationDate.learningPhaseIsActive) {
					activationDate.statusCode = -1;
					activationDate.statusText = TAPi18n.__('learningHistory.table.status.inProgress');
				} else {
					if (completedWorkload > 0) {
						let unfinishedWorkload = activationDate.workload - completedWorkload;
						if (unfinishedWorkload === 1) {
							activationDate.statusCode = -2;
							activationDate.statusText = TAPi18n.__('learningHistory.table.status.notFullyCompletedSingular', {cards: unfinishedWorkload});
						} else {
							activationDate.statusCode = -3;
							activationDate.statusText = TAPi18n.__('learningHistory.table.status.notFullyCompletedPlural', {cards: unfinishedWorkload});
						}
					} else {
						activationDate.statusCode = -4;
						activationDate.statusText = TAPi18n.__('learningHistory.table.status.notCompleted');
					}
				}
				completedPreviousWorkload = false;
			}
		}
		return Utilities.sortArray(userHistory.reverse(), config.defaultUserHistorySortSettings.content, config.defaultUserHistorySortSettings.desc);
	}
	static prepareActivationDateHistoryData (activationDayHistory) {
		for (let i = 0; i < activationDayHistory.length; i++) {
			let card = activationDayHistory[i];

			//Set subject
			activationDayHistory[i].cardSubject = card.cardData.subject;

			//Set submission
			activationDayHistory[i].cardSubmission = card.timestamps.submission;

			//Set answer time
			activationDayHistory[i].answerTime = card.timestamps.submission - card.timestamps.question;

			//Set cardType and cardType name
			activationDayHistory[i].cardType = card.cardData.cardType;
			activationDayHistory[i].cardTypeName = CardType.getCardTypeName(card.cardData.cardType);

			//Set card content
			if (CardTypes.gotNoSideContent(card.cardData.cardType)) {
				if (card.cardData.answers !== undefined && card.cardData.answers.question !== undefined) {
					activationDayHistory[i].content = card.cardData.answers.question;
				} else {
					activationDayHistory[i].content = "";
				}
			} else {
				let cubeSides = CardType.getCardTypeCubeSides(card.cardData.cardType);
				switch (cubeSides[0].contentId) {
					case 1:
						activationDayHistory[i].content = card.cardData.front;
						break;
					case 2:
						activationDayHistory[i].content = card.cardData.back;
						break;
					case 3:
						activationDayHistory[i].content = card.cardData.hint;
						break;
					case 4:
						activationDayHistory[i].content = card.cardData.lecture;
						break;
					case 5:
						activationDayHistory[i].content = card.cardData.top;
						break;
					case 6:
						activationDayHistory[i].content = card.cardData.bottom;
						break;
				}
			}
			let text = CardVisuals.removeMarkdeepTags(activationDayHistory[i].content);
			if (text.length > config.maxTaskHistoryContentLength) {
				activationDayHistory[i].content =  text.substr(0, config.maxTaskHistoryContentLength) +  '...';
			} else {
				activationDayHistory[i].content =  text;
			}
			activationDayHistory[i].cardSubject = `${activationDayHistory[i].cardSubject}: ${activationDayHistory[i].content}`;
		}
		return Utilities.sortArray(activationDayHistory, config.defaultActivationDayHistorySortSettings.content, config.defaultActivationDayHistorySortSettings.desc);
	}
};
