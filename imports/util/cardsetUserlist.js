import {ServerStyle} from "./styles";
import {getAuthorName} from "./userData";
import * as config from "../config/bonusForm";
import {Meteor} from "meteor/meteor";
import {Profile} from "./profile";
import {LeitnerHistory} from "../api/subscriptions/leitnerHistory";
import {Leitner} from "../api/subscriptions/leitner";

export let CardsetUserlist = class CardsetUserlist {
	static getLearningStatus (learningEnd) {
		if (learningEnd.getTime() > new Date().getTime()) {
			return TAPi18n.__('set-list.activeLearnphase', {}, ServerStyle.getClientLanguage());
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase', {}, ServerStyle.getClientLanguage());
		}
	}

	static getCardsetInfo (cardset) {
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

	static getCurrentMaxBonusPoints (cardset) {
		if (cardset.workload.bonus.maxPoints === undefined) {
			return config.defaultMaxBonusPoints;
		} else {
			return cardset.workload.bonus.maxPoints;
		}
	}

	static getCurrentMinLearned (cardset) {
		if (cardset.workload.bonus.minLearned === undefined) {
			return config.defaultMinLearned;
		} else {
			return cardset.workload.bonus.minLearned;
		}
	}

	static getLearningPhaseInfo (cardset) {
		return [
			["", ""],
			[TAPi18n.__('set-list.learnphaseInfo', {}, ServerStyle.getClientLanguage()), ""],
			[TAPi18n.__('set-list.learnphase', {}, ServerStyle.getClientLanguage()), this.getLearningStatus(cardset.learningEnd)],
			[TAPi18n.__('cardset.info.workload.bonus.count', {}, ServerStyle.getClientLanguage()), cardset.workload.bonus.count],
			[TAPi18n.__('set-list.bonusMaxPoints.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMaxPoints.content', {count: this.getCurrentMaxBonusPoints(cardset)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('set-list.bonusMin.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMin.content', {count: this.getCurrentMinLearned(cardset)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.maxWorkload.label', {}, ServerStyle.getClientLanguage()), cardset.maxCards],
			[TAPi18n.__('bonus.form.daysBeforeReset.label', {}, ServerStyle.getClientLanguage()), cardset.daysBeforeReset],
			[TAPi18n.__('bonus.form.startDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningStart).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.endDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningEnd).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.registrationPeriod.label', {}, ServerStyle.getClientLanguage()), moment(cardset.registrationPeriod).locale(ServerStyle.getClientLanguage()).format('LL')]
		];
	}

	static sortByBirthname (data) {
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

	static getLearners (data, cardset_id) {
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
		return this.sortByBirthname(learningDataArray);
	}
};