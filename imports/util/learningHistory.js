import {Bonus} from "./bonus";
import {Session} from "meteor/session";
import {CardType, CardType as CardTypes} from "./cardTypes";
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/learningHistory";
import {Utilities} from "./utilities";
import {LeitnerLearningPhaseUtilities} from "./learningPhase";

export let LeitnerHistoryUtilities = class LearningHistory {
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
		}
		return bonusUsers;
	}

	static prepareUserHistoryData (userHistory) {
		//Set status
		for (let i = 0; i < userHistory.length; i++) {
			let activationDate = userHistory[i];
			let completedWorkload = activationDate.known + activationDate.notKnown;
			if (completedWorkload === activationDate.workload) {
				userHistory[i].statusCode = activationDate.lastActivity;
				userHistory[i].statusText = TAPi18n.__('learningHistory.table.status.completed', {lastAnswerDate: Utilities.getMomentsDate(activationDate.lastActivity, 0, false, false)});
			} else if (!activationDate.missedDeadline) {
				userHistory[i].statusCode = -1;
				userHistory[i].statusText = TAPi18n.__('learningHistory.table.status.inProgress');
			} else {
				if (completedWorkload > 0) {
					let unfinishedWorkload = activationDate.workload - completedWorkload;
					if (unfinishedWorkload === 1) {
						userHistory[i].statusCode = -2;
						userHistory[i].statusText = TAPi18n.__('learningHistory.table.status.notFullyCompletedSingular', {cards: unfinishedWorkload});
					} else {
						userHistory[i].statusCode = -3;
						userHistory[i].statusText = TAPi18n.__('learningHistory.table.status.notFullyCompletedPlural', {cards: unfinishedWorkload});
					}
				} else {
					userHistory[i].statusCode = -4;
					userHistory[i].statusText = TAPi18n.__('learningHistory.table.status.notCompleted');
				}
			}
		}
		return userHistory;
	}
	static prepareActivationDateHistoryData (taskHistory) {
		for (let i = 0; i < taskHistory.length; i++) {
			let card = taskHistory[i];

			//Set subject
			taskHistory[i].cardSubject = card.cardData.subject;

			//Set submission
			taskHistory[i].cardSubmission = card.timestamps.submission;

			//Set answer time
			taskHistory[i].answerTime = card.timestamps.submission - card.timestamps.question;

			//Set cardType and cardType name
			taskHistory[i].cardType = card.cardData.cardType;
			taskHistory[i].cardTypeName = CardType.getCardTypeName(card.cardData.cardType);

			//Set card content
			if (CardTypes.gotNoSideContent(card.cardData.cardType)) {
				if (card.cardData.answers !== undefined && card.cardData.answers.question !== undefined) {
					taskHistory[i].content = card.cardData.answers.question;
				} else {
					taskHistory[i].content = "";
				}
			} else {
				let cubeSides = CardType.getCardTypeCubeSides(card.cardData.cardType);
				switch (cubeSides[0].contentId) {
					case 1:
						taskHistory[i].content = card.cardData.front;
						break;
					case 2:
						taskHistory[i].content = card.cardData.back;
						break;
					case 3:
						taskHistory[i].content = card.cardData.hint;
						break;
					case 4:
						taskHistory[i].content = card.cardData.lecture;
						break;
					case 5:
						taskHistory[i].content = card.cardData.top;
						break;
					case 6:
						taskHistory[i].content = card.cardData.bottom;
						break;
				}
			}
			let text = CardVisuals.removeMarkdeepTags(taskHistory[i].content);
			if (text.length > config.maxTaskHistoryContentLength) {
				taskHistory[i].content =  text.substr(0, config.maxTaskHistoryContentLength) +  '...';
			} else {
				taskHistory[i].content =  text;
			}
			taskHistory[i].subject = `${taskHistory[i].subject}: ${taskHistory[i].content}`;
		}
		return taskHistory;
	}
};
