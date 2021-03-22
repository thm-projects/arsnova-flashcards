import {Meteor} from "meteor/meteor";
import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";
import {Utilities} from "./utilities";
import {LeitnerActivationDay} from "../api/subscriptions/leitner/leitnerActivationDay";
import {LeitnerLearningPhase} from "../api/subscriptions/leitner/leitnerLearningPhase";



export let LearningStatisticsUtilities = class LearningStatisticsUtilities {
	static setPerformanceStats (activationDay) {
		if (Meteor.isServer && activationDay !== undefined) {
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

			for (let i = 0; i < activationDayHistory.length; i++) {
				milliseconds.push(Math.round((activationDayHistory[i].timestamps.submission - activationDayHistory[i].timestamps.question)));
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

			//Update Session Stats
			if (activationDay.user_id !== undefined) {
				let activationDays = LeitnerActivationDay.find({user_id: activationDay.user_id, cardset_id: activationDay.cardset_id, learning_phase_id: activationDay.learning_phase_id,  "performanceStats.answerTime.median": {$exists: true}}).fetch();
				answerTime = {
					median: [],
					arithmeticMean: [],
					standardDeviation: []
				};
				workingTime = {
					sum: [],
					median: [],
					arithmeticMean: [],
					standardDeviation: []
				};

				for (let i = 0; i < activationDays.length; i++) {
					if (activationDays[i].performanceStats.answerTime.median > 0) {
						answerTime.median.push(activationDays[i].performanceStats.answerTime.median);
					}
					if (activationDays[i].performanceStats.answerTime.arithmeticMean > 0) {
						answerTime.arithmeticMean.push(activationDays[i].performanceStats.answerTime.arithmeticMean);
					}
					if (activationDays[i].performanceStats.answerTime.standardDeviation > 0) {
						answerTime.standardDeviation.push(activationDays[i].performanceStats.answerTime.standardDeviation);
					}
					if (activationDays[i].performanceStats.workingTime.sum > 0) {
						workingTime.sum.push(activationDays[i].performanceStats.workingTime.sum);
					}
				}
				newPerformanceStats = {
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
							"performanceStats": newPerformanceStats
						}
					}
				);
				let workload = LeitnerLearningWorkload.findOne({
					user_id: activationDay.user_id,
					cardset_id: activationDay.cardset_id,
					isActive: true
				}, {fields: {"isBonus": 1}});

				if (workload !== undefined) {
					query = {
						cardset_id: activationDay.cardset_id,
						"performanceStats": {$exists: true}
					};
					query.isBonus = !!workload.isBonus;

					let cardsetWorkloads = LeitnerLearningWorkload.find(query).fetch();
					answerTime = {
						median: [],
						arithmeticMean: [],
						standardDeviation: []
					};
					workingTime = {
						sum: [],
						median: [],
						arithmeticMean: [],
						standardDeviation: []
					};
					for (let i = 0; i < cardsetWorkloads.length; i++) {
						if (cardsetWorkloads[i].performanceStats.answerTime.median > 0) {
							answerTime.median.push(cardsetWorkloads[i].performanceStats.answerTime.median);
						}
						if (cardsetWorkloads[i].performanceStats.answerTime.arithmeticMean > 0) {
							answerTime.arithmeticMean.push(cardsetWorkloads[i].performanceStats.answerTime.arithmeticMean);
						}
						if (cardsetWorkloads[i].performanceStats.answerTime.standardDeviation > 0) {
							answerTime.standardDeviation.push(cardsetWorkloads[i].performanceStats.answerTime.standardDeviation);
						}
						if (cardsetWorkloads[i].performanceStats.workingTime.median > 0) {
							workingTime.median.push(cardsetWorkloads[i].performanceStats.workingTime.median);
						}
						if (cardsetWorkloads[i].performanceStats.workingTime.arithmeticMean > 0) {
							workingTime.arithmeticMean.push(cardsetWorkloads[i].performanceStats.workingTime.arithmeticMean);
						}
						if (cardsetWorkloads[i].performanceStats.workingTime.standardDeviation > 0) {
							workingTime.standardDeviation.push(cardsetWorkloads[i].performanceStats.workingTime.standardDeviation);
						}
						if (cardsetWorkloads[i].performanceStats.workingTime.sum > 0) {
							workingTime.sum.push(cardsetWorkloads[i].performanceStats.workingTime.sum);
						}
					}
					newPerformanceStats = {
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

					if (workload.isBonus) {
						LeitnerLearningPhase.update({
								_id: activationDay.learning_phase_id
							},
							{
								$set: {
									"performanceStats.answerTime.median.bonus": newPerformanceStats.answerTime.median,
									"performanceStats.answerTime.arithmeticMean.bonus": newPerformanceStats.answerTime.arithmeticMean,
									"performanceStats.answerTime.standardDeviation.bonus": newPerformanceStats.answerTime.standardDeviation,
									"performanceStats.workingTime.sum.bonus": newPerformanceStats.workingTime.sum,
									"performanceStats.workingTime.median.bonus": newPerformanceStats.workingTime.median,
									"performanceStats.workingTime.arithmeticMean.bonus": newPerformanceStats.workingTime.arithmeticMean,
									"performanceStats.workingTime.standardDeviation.bonus": newPerformanceStats.workingTime.standardDeviation
								}
							}
						);
					} else {
						LeitnerLearningPhase.update({
								_id: activationDay.learning_phase_id
							},
							{
								$set: {
									"performanceStats.answerTime.median.normal": newPerformanceStats.answerTime.median,
									"performanceStats.answerTime.arithmeticMean.normal": newPerformanceStats.answerTime.arithmeticMean,
									"performanceStats.answerTime.standardDeviation.normal": newPerformanceStats.answerTime.standardDeviation,
									"performanceStats.workingTime.sum.normal": newPerformanceStats.workingTime.sum,
									"performanceStats.workingTime.median.normal": newPerformanceStats.workingTime.median,
									"performanceStats.workingTime.arithmeticMean.normal": newPerformanceStats.workingTime.arithmeticMean,
									"performanceStats.workingTime.standardDeviation.normal": newPerformanceStats.workingTime.standardDeviation
								}
							}
						);
					}
				}
			}
		}
	}
};
