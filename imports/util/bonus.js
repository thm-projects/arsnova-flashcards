import {Cardsets} from "../api/subscriptions/cardsets";
import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {ServerSettings} from "./settings";

export let Bonus = class Bonus {
	static isInBonus (cardset_id, user_id = undefined) {
		if (user_id === undefined) {
			user_id = Meteor.userId();
		}
		let leitnerWorkload = LeitnerLearningWorkload.findOne({
			user_id: user_id,
			cardset_id: cardset_id,
			isActive: true
		}, {fields: {isBonus: 1}});
		if (leitnerWorkload !== undefined) {
			return leitnerWorkload.isBonus;
		} else {
			return false;
		}
	}

	static canJoinBonus (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1, kind: 1}});
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked'])) {
			return false;
		}
		let roles = ['admin', 'editor', 'lecturer', 'university', 'pro'];
		if (cardset.kind === "free") {
			roles.push('standard');
		}
		if (Roles.userIsInRole(Meteor.userId(), roles)) {
			return !this.isInBonus(cardset._id);
		} else {
			return false;
		}
	}

	static isRegistrationPeriodActive (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset.bonusStatus !== undefined) {
			return cardset.bonusStatus === 1 || cardset.bonusStatus === 2;
		}
	}

	static getAchievedBonus (box6, bonusPoints, total) {
		let box6Goal = (total / 100) * bonusPoints.minLearned;
		let bonusPointSteps = box6 / 10;
		if (bonusPoints.maxPoints !== 0) {
			bonusPointSteps = box6Goal / bonusPoints.maxPoints;
		}
		let achievedBonus = Math.round(box6 / bonusPointSteps) ;
		if (achievedBonus > bonusPoints.maxPoints) {
			return bonusPoints.maxPoints;
		} else {
			return achievedBonus;
		}
	}

	static getNotificationStatus (user, isCSVExport = false) {
		let notifications = "";
		if (ServerSettings.isMailEnabled() && user.mailNotification) {
			if (isCSVExport) {
				notifications += TAPi18n.__('learningStatistics.notification.mail', {}, "de");
			} else {
				notifications += "<span class='fas fa-envelope'> " + TAPi18n.__('learningStatistics.notification.mail') + "</span>";
			}
		}
		if (ServerSettings.isPushEnabled() && user.webNotification) {
			if (notifications !== "") {
				notifications += " & ";
			}
			if (isCSVExport) {
				notifications += TAPi18n.__('learningStatistics.notification.push', {}, "de");
			} else {
				notifications += "<span class='fas fa-bell'> " + TAPi18n.__('learningStatistics.notification.push') + "</span>";
			}
		}
		return notifications;
	}
};
