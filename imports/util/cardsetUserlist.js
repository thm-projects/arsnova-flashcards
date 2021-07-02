import {ServerStyle} from "./styles";
import {getAuthorName} from "./userData";
import {Meteor} from "meteor/meteor";
import {Profile} from "./profile";
import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {Cardsets} from "../api/subscriptions/cardsets";
import {LeitnerUserCardStats} from "../api/subscriptions/leitner/leitnerUserCardStats";
import {Utilities} from "./utilities";
import {LeitnerLearningPhaseUtilities} from "./learningPhase";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {LeitnerLearningPhase} from "../api/subscriptions/leitner/leitnerLearningPhase";
import {BonusForm} from "./bonusForm";
import {LearningStatisticsUtilities} from "./learningStatistics";

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

	static getLearningPhaseInfo (cardset, learning_phase_id) {
		let learningPhase = LeitnerLearningPhase.findOne({_id: learning_phase_id});
		const cardInteractionStats = LearningStatisticsUtilities.getCardInteractionStats(learning_phase_id, "", true);
		let learningPhaseInfoStart = [
			["", ""],
			[TAPi18n.__('set-list.learnphaseInfo', {}, ServerStyle.getClientLanguage()), ""]
		];
		let learningPhaseInfoTitle = [];
		if (learningPhase.title !== undefined && learningPhase.title.length) {
			learningPhaseInfoTitle = [
				[TAPi18n.__('bonus.form.title.label', {}, ServerStyle.getClientLanguage()), learningPhase.title]
			];
		}
		let learningPhaseInfoText = [
			["", ""],
			[TAPi18n.__('set-list.bonusSection.settings', {}, ServerStyle.getClientLanguage()), ""],
			[TAPi18n.__('set-list.learnphase', {}, ServerStyle.getClientLanguage()), this.getLearningStatus(learningPhase.end)],
			[TAPi18n.__('set-list.bonusMaxPoints.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMaxPoints.content', {count: BonusForm.getCurrentMaxBonusPoints(learningPhase)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('set-list.bonusMin.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('set-list.bonusMin.content', {count: BonusForm.getCurrentMinLearned(learningPhase)}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.maxWorkload.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('confirmLearn-form.card', {count: learningPhase.maxCards}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.daysBeforeReset.label', {}, ServerStyle.getClientLanguage()), TAPi18n.__('panel-body-experience.day', {count: learningPhase.daysBeforeReset}, ServerStyle.getClientLanguage())],
			[TAPi18n.__('bonus.form.startDate.label', {}, ServerStyle.getClientLanguage()), moment(learningPhase.start).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.endDate.label', {}, ServerStyle.getClientLanguage()), moment(learningPhase.end).locale(ServerStyle.getClientLanguage()).format('LL')],
			[TAPi18n.__('bonus.form.registrationPeriod.label', {}, ServerStyle.getClientLanguage()), moment(learningPhase.registrationPeriod).locale(ServerStyle.getClientLanguage()).format('LL')],
			['', ''],
			[TAPi18n.__('set-list.bonusSection.stats', {}, ServerStyle.getClientLanguage()), ""],
			[TAPi18n.__('cardset.info.workload.bonus.count', {}, ServerStyle.getClientLanguage()), TAPi18n.__('cardset.info.workload.bonus.user', {count: LeitnerLearningWorkload.find({learning_phase_id: learningPhase._id}).count()}, ServerStyle.getClientLanguage())],
			['', ''],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.sum', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.workingTime.sum)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.arithmeticMean', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.workingTime.arithmeticMean)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.median', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.workingTime.median)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.standardDeviation', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.workingTime.standardDeviation)],
			['', ''],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.arithmeticMean', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.answerTime.arithmeticMean)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.median', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.answerTime.median)],
			[TAPi18n.__('learningHistory.stats.duration.workingTime.standardDeviation', {}, ServerStyle.getClientLanguage()), Utilities.humanizeDuration(learningPhase.performanceStats.answerTime.standardDeviation)],
			['', ''],
			["Ø " + TAPi18n.__('learningHistory.stats.counter.assigned', {}, ServerStyle.getClientLanguage()), TAPi18n.__('learningHistory.stats.counter.cards', {cards: cardInteractionStats.assigned.count, totalCards: cardInteractionStats.total, percent: cardInteractionStats.assigned.percentage}, ServerStyle.getClientLanguage())],
			["Ø " + TAPi18n.__('learningHistory.stats.counter.answered', {}, ServerStyle.getClientLanguage()), TAPi18n.__('learningHistory.stats.counter.cards', {cards: cardInteractionStats.answered.count, totalCards: cardInteractionStats.total, percent: cardInteractionStats.answered.percentage}, ServerStyle.getClientLanguage())]
		];
		if (learningPhaseInfoTitle.length) {
			return _.union(learningPhaseInfoStart, learningPhaseInfoTitle, learningPhaseInfoText);
		} else {
			return _.union(learningPhaseInfoStart, learningPhaseInfoText);
		}
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

	static getLearners (data, cardset_id, learning_phase_id) {
		let learningDataArray = [];
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset !== undefined) {
			let learningPhase = LeitnerLearningPhaseUtilities.getLearningPhase(learning_phase_id);
			if (learningPhase.cardset_id === cardset._id && learningPhase.isBonus) {
				for (const item of data) {
					let user = Meteor.users.findOne({_id: item.user_id});
					if (user !== undefined) {
						if (user.profile.name !== undefined && !Profile.isCompleted(user)) {
							user.profile.birthname = user.profile.name;
							user.profile.givenname = TAPi18n.__('learningStatistics.user.missingName', {}, ServerStyle.getClientLanguage());
							user.email = "";
						}
						let lastActivity = item.createdAt;


						let userWorkload = LeitnerLearningWorkload.findOne({user_id: user._id, learning_phase_id: learningPhase._id});
						let filter = [];
						for (let l = 1; l <= 6; l++) {
							filter.push({
								learning_phase_id: learningPhase._id,
								workload_id: userWorkload._id,
								cardset_id: cardset_id,
								user_id: user._id,
								box: l
							});
						}
						if (userWorkload !== undefined) {
							let lastHistoryItem = LeitnerPerformanceHistory.findOne({
									workload_id: userWorkload._id,
									cardset_id: cardset_id,
									user_id: item.user_id,
									answer: {$exists: true}},
								{sort: {"timestamps.submission": -1}, fields: {_id: 1, timestamps: 1}});
							if (lastHistoryItem !== undefined && lastHistoryItem.timestamps !== undefined) {
								lastActivity = lastHistoryItem.timestamps.submission;
							}

							let mailNotification = user.mailNotification;
							if (learningPhase.forceNotifications.mail) {
								mailNotification = true;
							}

							let webNotification = user.webNotification;
							if (learningPhase.forceNotifications.push) {
								webNotification = true;
							}

							if (user.profile !== undefined) {
								let cardMedian = 0;
								let cardArithmeticMean = 0;
								let cardStandardDeviation = 0;
								let workingTimeSum = 0;
								let workingTimeArithmeticMean = 0;
								let workingTimeMedian = 0;
								let workingTimeStandardDeviation = 0;
								if (item !== undefined && item.performanceStats !== undefined && item.performanceStats.answerTime !== undefined) {
									cardMedian = item.performanceStats.answerTime.median;
									cardArithmeticMean = item.performanceStats.answerTime.arithmeticMean;
									cardStandardDeviation = item.performanceStats.answerTime.standardDeviation;
									workingTimeSum = item.performanceStats.workingTime.sum;
									workingTimeArithmeticMean = item.performanceStats.workingTime.arithmeticMean;
									workingTimeMedian = item.performanceStats.workingTime.median;
									workingTimeStandardDeviation = item.performanceStats.workingTime.standardDeviation;
								}
								learningDataArray.push({
									user_id: user._id,
									workload_id: userWorkload._id,
									learning_phase_id: userWorkload.learning_phase_id,
									birthname: user.profile.birthname,
									givenname: user.profile.givenname,
									email: user.email,
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
									dateJoinedBonus: item.createdAt,
									lastActivity: lastActivity
								});
							}
						}
					}
				}
			}
			return this.sortByBirthname(learningDataArray);
		} else {
			return [];
		}
	}
};
