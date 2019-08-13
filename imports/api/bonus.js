import {Cardsets} from "./cardsets";
import {Meteor} from "meteor/meteor";
import {Workload} from "./learned";
import {ServerSettings} from "./settings";

export let Bonus = class Bonus {
	static isInBonus (cardset_id, user_id = undefined) {
		if (user_id === undefined) {
			user_id = Meteor.userId();
		}
		let workload = Workload.findOne({user_id: user_id, cardset_id: cardset_id}, {fields: {'leitner.bonus': 1}});
		if (workload !== undefined && workload.leitner !== undefined && workload.leitner.bonus !== undefined) {
			return workload.leitner.bonus === true;
		} else {
			return false;
		}
	}

	static canJoinBonus (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, registrationPeriod: 1, owner: 1, kind: 1}});
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked'])) {
			return false;
		}
		let roles = ['admin', 'editor', 'lecturer', 'university', 'pro'];
		if (cardset.kind === "free") {
			roles.push('standard');
		}
		if (Roles.userIsInRole(Meteor.userId(), roles)) {
			return !this.isInBonus(cardset._id) && moment(cardset.registrationPeriod).endOf('day') > new Date();
		} else {
			return false;
		}
	}

	static getAchievedBonus (box6, workload, total) {
		let box6Goal = (total / 100) * workload.bonus.minLearned;
		let bonusPointSteps = box6 / 10;
		if (workload.bonus.maxPoints !== 0) {
			bonusPointSteps = box6Goal / workload.bonus.maxPoints;
		}
		let achievedBonus = Math.round(box6 / bonusPointSteps) ;
		if (achievedBonus > workload.bonus.maxPoints) {
			return workload.bonus.maxPoints;
		} else {
			return achievedBonus;
		}
	}

	static getNotificationStatus (user, isCSVExport = false) {
		let notifications = "";
		if (ServerSettings.isMailEnabled() && user.mailNotification) {
			if (isCSVExport) {
				notifications += TAPi18n.__('leitnerProgress.notification.mail', {}, "de");
			} else {
				notifications += "<i class='fas fa-envelope'> " + TAPi18n.__('leitnerProgress.notification.mail') + "</i>";
			}
		}
		if (ServerSettings.isPushEnabled() && user.webNotification) {
			if (notifications !== "") {
				notifications += " & ";
			}
			if (isCSVExport) {
				notifications += TAPi18n.__('leitnerProgress.notification.push', {}, "de");
			} else {
				notifications += "<i class='fas fa-bell'> " + TAPi18n.__('leitnerProgress.notification.push') + "</i>";
			}
		}
		return notifications;
	}
};
