import {ServerStyle} from "./styles";
import {getAuthorName} from "./userData";
import * as config from "../config/bonusForm";
import {Meteor} from "meteor/meteor";
import {Profile} from "./profile";
import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerActivationDay} from "../api/subscriptions/leitner/leitnerActivationDay";
import {Cardsets} from "../api/subscriptions/cardsets";
import {LeitnerUserCardStats} from "../api/subscriptions/leitner/leitnerUserCardStats";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {Utilities} from "./utilities";

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
			[TAPi18n.__('cardset.info.quantity', {}, ServerStyle.getClientLanguage()), TAPi18n.__('confirmLearn-form.card', {count: cardset.quantity}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('cardset.info.author', {}, ServerStyle.getClientLanguage()), getAuthorName(cardset.owner, false)],
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
			[TAPi18n.__('set-list.bonusSection.settings', {}, ServerStyle.getClientLanguage()), ""],
			[TAPi18n.__('set-list.learnphase', {}, ServerStyle.getClientLanguage()), this.getLearningStatus(cardset.learningEnd)],
			[TAPi18n.__('set-list.bonusMaxPoints.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMaxPoints.content', {count: this.getCurrentMaxBonusPoints(cardset)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('set-list.bonusMin.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMin.content', {count: this.getCurrentMinLearned(cardset)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.maxWorkload.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('confirmLearn-form.card', {count: cardset.maxCards}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.daysBeforeReset.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('panel-body-experience.day', {count: cardset.daysBeforeReset}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.startDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningStart).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.endDate.label', {}, ServerStyle.getClientLanguage()), moment(cardset.learningEnd).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.registrationPeriod.label', {}, ServerStyle.getClientLanguage()), moment(cardset.registrationPeriod).locale(ServerStyle.getClientLanguage()).format('LL')],
			['', ''],
			[TAPi18n.__('set-list.bonusSection.stats', {}, ServerStyle.getClientLanguage()), ""],
			[TAPi18n.__('cardset.info.workload.bonus.count', {}, ServerStyle.getClientLanguage()), TAPi18n.__('cardset.info.workload.bonus.user', {count: cardset.workload.bonus.count}, ServerStyle.getClientLanguage())],
			['', ''],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.sum', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.workingTime.sum.bonus)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.arithmeticMean', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.workingTime.arithmeticMean.bonus)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.median', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.workingTime.median.bonus)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.standardDeviation', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.workingTime.standardDeviation.bonus)],
			['', ''],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.arithmeticMean', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.answerTime.arithmeticMean.bonus)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.median', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.answerTime.median.bonus)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.standardDeviation', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(cardset.learningStatistics.answerTime.standardDeviation.bonus)]
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
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset !== undefined) {
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
					user[0].profile.givenname = TAPi18n.__('learningStatistics.user.missingName', {}, ServerStyle.getClientLanguage());
					user[0].email = "";
				}
				let lastActivity = data[i].leitner.dateJoinedBonus;

				let sessionFilter = 0;
				let highestTask = LeitnerActivationDay.findOne({
					cardset_id: cardset_id,
					user_id: data[i].user_id
				}, {sort: {session: -1}});
				if (highestTask !== undefined) {
					sessionFilter = highestTask.session;
				}
				let whitelistedTasks = LeitnerActivationDay.find({
					cardset_id: cardset_id,
					user_id: data[i].user_id,
					session: sessionFilter
				}).fetch().map(function (x) {
					return x._id;
				});

				let lastHistoryItem = LeitnerPerformanceHistory.findOne({
						task_id: {$in: whitelistedTasks},
						cardset_id: cardset_id,
						user_id: data[i].user_id,
						answer: {$exists: true}},
					{sort: {"timestamps.submission": -1}, fields: {_id: 1, timestamps: 1}});
				if (lastHistoryItem !== undefined && lastHistoryItem.timestamps !== undefined) {
					lastActivity = lastHistoryItem.timestamps.submission;
				}

				let mailNotification = user[0].mailNotification;
				if (cardset.forceNotifications.mail) {
					mailNotification = true;
				}

				let webNotification = user[0].webNotification;
				if (cardset.forceNotifications.push) {
					webNotification = true;
				}

				if (user[0].profile !== undefined) {
					let cardMedian = 0;
					let cardArithmeticMean = 0;
					let cardStandardDeviation = 0;
					let workingTimeSum = 0;
					let workingTimeArithmeticMean = 0;
					let workingTimeMedian = 0;
					let workingTimeStandardDeviation = 0;
					let workload = LeitnerLearningWorkload.findOne({user_id: user[0]._id, cardset_id: cardset_id, "leitner.bonus": true});
					if (workload !== undefined && workload.leitner.learningStatistics !== undefined && workload.leitner.learningStatistics.answerTime !== undefined) {
						cardMedian = workload.leitner.learningStatistics.answerTime.median;
						cardArithmeticMean = workload.leitner.learningStatistics.answerTime.arithmeticMean;
						cardStandardDeviation = workload.leitner.learningStatistics.answerTime.standardDeviation;
						workingTimeSum = workload.leitner.learningStatistics.workingTime.sum;
						workingTimeArithmeticMean = workload.leitner.learningStatistics.workingTime.arithmeticMean;
						workingTimeMedian = workload.leitner.learningStatistics.workingTime.median;
						workingTimeStandardDeviation = workload.leitner.learningStatistics.workingTime.standardDeviation;
					}
					learningDataArray.push({
						user_id: user[0]._id,
						birthname: user[0].profile.birthname,
						givenname: user[0].profile.givenname,
						email: user[0].email,
						cardMedian: cardMedian,
						cardArithmeticMean: cardArithmeticMean,
						cardStandardDeviation: cardStandardDeviation,
						workingTimeSum: workingTimeSum,
						workingTimeArithmeticMean: workingTimeArithmeticMean,
						workingTimeMedian: workingTimeMedian,
						workingTimeStandardDeviation: workingTimeStandardDeviation,
						box1: LeitnerUserCardStats.find(filter[0]).count(),
						box2: LeitnerUserCardStats.find(filter[1]).count(),
						box3: LeitnerUserCardStats.find(filter[2]).count(),
						box4: LeitnerUserCardStats.find(filter[3]).count(),
						box5: LeitnerUserCardStats.find(filter[4]).count(),
						box6: LeitnerUserCardStats.find(filter[5]).count(),
						mailNotification: mailNotification,
						webNotification: webNotification,
						dateJoinedBonus: data[i].leitner.dateJoinedBonus,
						lastActivity: lastActivity
					});
				}
			}
			return this.sortByBirthname(learningDataArray);
		} else {
			return [];
		}
	}
};
