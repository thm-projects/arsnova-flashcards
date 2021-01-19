import {Bonus} from "./bonus";
import {Session} from "meteor/session";
import {CardType, CardType as CardTypes} from "./cardTypes";
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/leitnerHistory";
import {Utilities} from "./utilities";

export let LeitnerHistoryUtilities = class LeitnerProgress {
	static prepareBonusUserData (bonusUsers) {
		for (let i = 0; i < bonusUsers.length; i++) {
			let user = bonusUsers[i];
			//Set hidden username
			bonusUsers[i].placeholderID = i + 1;
			bonusUsers[i].placeholderName = TAPi18n.__('leitnerProgress.hiddenUserPlaceholder', {index: i + 1}, "de");
			//Set bonus percentage
			let totalCards = user.box1 + user.box2 + user.box3 + user.box4 + user.box5 + user.box6;
			bonusUsers[i].percentage = Math.round(user.box6 / totalCards * 100);

			//Set achieved bonus
			bonusUsers[i].achievedBonus = Bonus.getAchievedBonus(user.box6, Session.get('activeCardset').workload, (user.box1 + user.box2 + user.box3 + user.box4 + user.box5 + user.box6));
		}
		return bonusUsers;
	}

	static prepareUserHistoryData (userHistory) {
		//Set status
		for (let i = 0; i < userHistory.length; i++) {
			let task = userHistory[i];
			let completedWorkload = task.known + task.notKnown;
			if (completedWorkload === task.workload) {
				userHistory[i].statusCode = task.lastAnswerDate;
				userHistory[i].statusText = TAPi18n.__('leitnerProgress.modal.userHistory.table.status.completed', {lastAnswerDate: Utilities.getMomentsDate(task.lastAnswerDate, 0, false, false)});
			} else if (!task.missedDeadline) {
				userHistory[i].statusCode = -1;
				userHistory[i].statusText = TAPi18n.__('leitnerProgress.modal.userHistory.table.status.inProgress');
			} else {
				if (completedWorkload > 0) {
					let unfinishedWorkload = task.workload - completedWorkload;
					if (unfinishedWorkload === 1) {
						userHistory[i].statusCode = -2;
						userHistory[i].statusText = TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notFullyCompletedSingular', {cards: unfinishedWorkload});
					} else {
						userHistory[i].statusCode = -3;
						userHistory[i].statusText = TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notFullyCompletedPlural', {cards: unfinishedWorkload});
					}
				} else {
					userHistory[i].statusCode = -4;
					userHistory[i].statusText = TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notCompleted');
				}
			}
		}
		return userHistory;
	}
	static prepareTaskHistoryData (taskHistory) {
		for (let i = 0; i < taskHistory.length; i++) {
			let card = taskHistory[i];

			//Set subject
			taskHistory[i].cardSubject = card.cardData.subject;

			//Set submission
			taskHistory[i].cardSubmission = card.timestamps.submission;

			//Set answer time
			taskHistory[i].answerTime = card.timestamps.submission - card.timestamps.question;

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
		}
		return taskHistory;
	}
};
