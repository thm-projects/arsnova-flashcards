import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {Utilities} from "./utilities";
import {LeitnerActivationDay} from "../api/subscriptions/leitner/leitnerActivationDay";
import {LeitnerLearningPhase} from "../api/subscriptions/leitner/leitnerLearningPhase";
import {Cardsets} from "../api/subscriptions/cardsets";
import {LeitnerUserCardStats} from "../api/subscriptions/leitner/leitnerUserCardStats";


export let LearningStatisticsUtilities = class LearningStatisticsUtilities {
	static updateAllStats (activationDay) {
		this.updateActivationDayStats(activationDay);
		this.updateWorkloadStats(activationDay);
		this.updateLearningPhaseStats(activationDay.learning_phase_id);
	}

	static updateActivationDayStats (activationDay) {
		let query = {
			activation_day_id: activationDay._id,
			cardset_id: activationDay.cardset_id,
			"timestamps.submission": {$exists: true}
		};

		if (activationDay.user_id !== undefined) {
			query.user_id = activationDay.user_id;
		} else {
			query.user_id_deleted = activationDay.user_id_deleted;
		}

		let activationDayHistory = LeitnerPerformanceHistory.find(query).fetch();
		let milliseconds = [];
		let answerTime = {
			median: 0,
			arithmeticMean: 0,
			standardDeviation: 0
		};
		let workingTime = {
			sum: 0
		};

		for (const item of activationDayHistory) {
			milliseconds.push(Math.round((item.timestamps.submission - item.timestamps.question)));
		}

		if (milliseconds.length) {
			answerTime.median = Math.round(Utilities.getMedian(milliseconds));
			answerTime.arithmeticMean = Math.round(Utilities.getArithmeticMean(milliseconds));
			answerTime.standardDeviation = Math.round(Utilities.getStandardDeviation(milliseconds));
			workingTime.sum = Math.round(Utilities.getSum(milliseconds));
		}

		let newPerformanceStats = {
			answerTime: answerTime,
			workingTime: workingTime
		};

		LeitnerActivationDay.update({
				_id: activationDay._id
			},
			{
				$set: {
					performanceStats: newPerformanceStats
				}
			}
		);
	}

	static updateWorkloadStats (activationDay) {
		let activationDays = LeitnerActivationDay.find({
			user_id: activationDay.user_id,
			cardset_id: activationDay.cardset_id,
			learning_phase_id: activationDay.learning_phase_id,
			"performanceStats.answerTime.median": {$exists: true}
		}).fetch();
		let answerTime = {
			median: [],
			arithmeticMean: [],
			standardDeviation: []
		};
		let workingTime = {
			sum: [],
			median: [],
			arithmeticMean: [],
			standardDeviation: []
		};

		for (const item of activationDays) {
			if (item.performanceStats.answerTime.median > 0) {
				answerTime.median.push(item.performanceStats.answerTime.median);
			}
			if (item.performanceStats.answerTime.arithmeticMean > 0) {
				answerTime.arithmeticMean.push(item.performanceStats.answerTime.arithmeticMean);
			}
			if (item.performanceStats.answerTime.standardDeviation > 0) {
				answerTime.standardDeviation.push(item.performanceStats.answerTime.standardDeviation);
			}
			if (item.performanceStats.workingTime.sum > 0) {
				workingTime.sum.push(item.performanceStats.workingTime.sum);
			}
		}

		let newPerformanceStats = {
			answerTime: {
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			},
			workingTime: {
				sum: 0,
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			}
		};
		if (answerTime.median.length === 1) {
			newPerformanceStats.answerTime.median = answerTime.median[0];
		} else {
			newPerformanceStats.answerTime.median = Math.round(Utilities.getMedian(answerTime.median));
		}
		if (answerTime.arithmeticMean.length === 1) {
			newPerformanceStats.answerTime.arithmeticMean = answerTime.arithmeticMean[0];
		} else {
			newPerformanceStats.answerTime.arithmeticMean = Math.round(Utilities.getMedian(answerTime.arithmeticMean));
		}
		if (answerTime.standardDeviation.length === 1) {
			newPerformanceStats.answerTime.standardDeviation = answerTime.standardDeviation[0];
		} else {
			newPerformanceStats.answerTime.standardDeviation = Math.round(Utilities.getMedian(answerTime.standardDeviation));
		}
		if (workingTime.sum.length === 1) {
			newPerformanceStats.workingTime.sum = workingTime.sum[0];
			newPerformanceStats.workingTime.median = workingTime.sum[0];
			newPerformanceStats.workingTime.arithmeticMean = workingTime.sum[0];
			newPerformanceStats.workingTime.standardDeviation = 0;
		} else {
			newPerformanceStats.workingTime.sum = Math.round(Utilities.getSum(workingTime.sum));
			newPerformanceStats.workingTime.median = Math.round(Utilities.getMedian(workingTime.sum));
			newPerformanceStats.workingTime.arithmeticMean = Math.round(Utilities.getArithmeticMean(workingTime.sum));
			newPerformanceStats.workingTime.standardDeviation = Math.round(Utilities.getStandardDeviation(workingTime.sum));
		}

		LeitnerLearningWorkload.update({
				user_id: activationDay.user_id,
				cardset_id: activationDay.cardset_id
			},
			{
				$set: {
					"performanceStats": newPerformanceStats,
					updatedAt: new Date()
				}
			}
		);
	}

	static getCardInteractionStats (learning_phase_id, user_id, isBonusStats = false) {
		let query = {
			learning_phase_id: learning_phase_id
		};

		if (!isBonusStats) {
			query.user_id = user_id;
		}
		let totalCards;
		let assignedCards;
		let answeredCards;
		if (isBonusStats) {
			let counterArray = [];

			let usersArray = _.uniq(LeitnerUserCardStats.find(query, {
				fields: {user_id: 1}
			}).fetch(), function (cardStats) {
				return cardStats.user_id;
			});

			if (usersArray.length) {
				query.user_id = usersArray[0].user_id;
				totalCards = LeitnerUserCardStats.find(query).count();
			}

			query.assignedCounter = {$gt: 0};
			usersArray.forEach(function (cardStats) {
				query.user_id = cardStats.user_id;
				counterArray.push(LeitnerUserCardStats.find(query).count());
			});
			assignedCards = Math.round(Utilities.getMedian(counterArray));

			delete query.assignedCounter;
			counterArray = [];
			query.$or = [
				{'stats.answers.known': {$gt: 0}},
				{'stats.answers.notKnown': {$gt: 0}}
			];
			usersArray.forEach(function (cardStats) {
				query.user_id = cardStats.user_id;
				counterArray.push(LeitnerUserCardStats.find(query).count());
			});
			answeredCards = Math.round(Utilities.getMedian(counterArray));
		} else {
			totalCards = LeitnerUserCardStats.find(query).count();

			query.assignedCounter = {$gt: 0};
			assignedCards = LeitnerUserCardStats.find(query).count();

			delete query.assignedCounter;
			query.$or = [
				{'stats.answers.known': {$gt: 0}},
				{'stats.answers.notKnown': {$gt: 0}}
			];
			answeredCards = LeitnerUserCardStats.find(query).count();
		}
		return {
			assigned: {
				count: assignedCards,
				percentage: Math.round((assignedCards / totalCards) * 100)
			},
			answered: {
				count: answeredCards,
				percentage: Math.round((answeredCards / totalCards) * 100)
			},
			total: totalCards
		};
	}

	static updateLearningPhaseStats (learning_phase_id) {
		let learningPhase = LeitnerLearningPhase.findOne({
			_id: learning_phase_id
		});

		let query = {
			cardset_id: learningPhase.cardset_id
		};

		if (learningPhase.isBonus) {
			query.learning_phase_id = learningPhase._id;
		} else {
			let bonusLearningPhases = LeitnerLearningPhase.find({
				cardset_id: learningPhase.cardset_id,
				isBonus: true
			}).fetch().map(learningPhase => learningPhase._id);
			query.learning_phase_id = {$nin: bonusLearningPhases};
		}

		let cardsetWorkloads = LeitnerLearningWorkload.find(query).fetch();
		let answerTime = {
			median: [],
			arithmeticMean: [],
			standardDeviation: []
		};
		let workingTime = {
			sum: [],
			median: [],
			arithmeticMean: [],
			standardDeviation: []
		};
		for (const item of cardsetWorkloads) {
			if (item.performanceStats.answerTime.median > 0) {
				answerTime.median.push(item.performanceStats.answerTime.median);
			}
			if (item.performanceStats.answerTime.arithmeticMean > 0) {
				answerTime.arithmeticMean.push(item.performanceStats.answerTime.arithmeticMean);
			}
			if (item.performanceStats.answerTime.standardDeviation > 0) {
				answerTime.standardDeviation.push(item.performanceStats.answerTime.standardDeviation);
			}
			if (item.performanceStats.workingTime.median > 0) {
				workingTime.median.push(item.performanceStats.workingTime.median);
			}
			if (item.performanceStats.workingTime.arithmeticMean > 0) {
				workingTime.arithmeticMean.push(item.performanceStats.workingTime.arithmeticMean);
			}
			if (item.performanceStats.workingTime.standardDeviation > 0) {
				workingTime.standardDeviation.push(item.performanceStats.workingTime.standardDeviation);
			}
			if (item.performanceStats.workingTime.sum > 0) {
				workingTime.sum.push(item.performanceStats.workingTime.sum);
			}
		}
		let newPerformanceStats = {
			answerTime: {
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			},
			workingTime: {
				sum: 0,
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			}
		};
		if (answerTime.median.length === 1) {
			newPerformanceStats.answerTime.median = answerTime.median[0];
		} else {
			newPerformanceStats.answerTime.median = Math.round(Utilities.getMedian(answerTime.median));
		}
		if (answerTime.arithmeticMean.length === 1) {
			newPerformanceStats.answerTime.arithmeticMean = answerTime.arithmeticMean[0];
		} else {
			newPerformanceStats.answerTime.arithmeticMean = Math.round(Utilities.getMedian(answerTime.arithmeticMean));
		}
		if (answerTime.standardDeviation.length === 1) {
			newPerformanceStats.answerTime.standardDeviation = answerTime.standardDeviation[0];
		} else {
			newPerformanceStats.answerTime.standardDeviation = Math.round(Utilities.getMedian(answerTime.standardDeviation));
		}
		if (workingTime.median.length === 1) {
			newPerformanceStats.workingTime.median = workingTime.median[0];
		} else {
			newPerformanceStats.workingTime.median = Math.round(Utilities.getMedian(workingTime.median));
		}
		if (workingTime.arithmeticMean.length === 1) {
			newPerformanceStats.workingTime.arithmeticMean = workingTime.arithmeticMean[0];
		} else {
			newPerformanceStats.workingTime.arithmeticMean = Math.round(Utilities.getMedian(workingTime.arithmeticMean));
		}
		if (workingTime.standardDeviation.length === 1) {
			newPerformanceStats.workingTime.standardDeviation = workingTime.standardDeviation[0];
		} else {
			newPerformanceStats.workingTime.standardDeviation = Math.round(Utilities.getMedian(workingTime.standardDeviation));
		}
		if (workingTime.sum.length === 1) {
			newPerformanceStats.workingTime.sum = workingTime.sum[0];
		} else {
			newPerformanceStats.workingTime.sum = Math.round(Utilities.getSum(workingTime.sum));
		}


		if (learningPhase.isBonus) {
			LeitnerLearningPhase.update({
					_id: learningPhase._id
				},
				{
					$set: {
						"performanceStats.answerTime.median": newPerformanceStats.answerTime.median,
						"performanceStats.answerTime.arithmeticMean": newPerformanceStats.answerTime.arithmeticMean,
						"performanceStats.answerTime.standardDeviation": newPerformanceStats.answerTime.standardDeviation,
						"performanceStats.workingTime.sum": newPerformanceStats.workingTime.sum,
						"performanceStats.workingTime.median": newPerformanceStats.workingTime.median,
						"performanceStats.workingTime.arithmeticMean": newPerformanceStats.workingTime.arithmeticMean,
						"performanceStats.workingTime.standardDeviation": newPerformanceStats.workingTime.standardDeviation
					}
				}
			);
		} else {
			Cardsets.update({
					_id: learningPhase.cardset_id
				},
				{
					$set: {
						"performanceStats.answerTime.median": newPerformanceStats.answerTime.median,
						"performanceStats.answerTime.arithmeticMean": newPerformanceStats.answerTime.arithmeticMean,
						"performanceStats.answerTime.standardDeviation": newPerformanceStats.answerTime.standardDeviation,
						"performanceStats.workingTime.sum": newPerformanceStats.workingTime.sum,
						"performanceStats.workingTime.median": newPerformanceStats.workingTime.median,
						"performanceStats.workingTime.arithmeticMean": newPerformanceStats.workingTime.arithmeticMean,
						"performanceStats.workingTime.standardDeviation": newPerformanceStats.workingTime.standardDeviation
					}
				}
			);
		}
	}
};
