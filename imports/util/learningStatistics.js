import {Meteor} from "meteor/meteor";
import {Cardsets} from "../api/subscriptions/cardsets";
import {LeitnerHistory} from "../api/subscriptions/leitnerHistory";
import {Workload} from "../api/subscriptions/workload";
import {Utilities} from "./utilities";
import {LeitnerTasks} from "../api/subscriptions/leitnerTasks";



export let LearningStatisticsUtilities = class LearningStatisticsUtilities {
	static setGlobalStatistics (task) {
		if (Meteor.isServer && task !== undefined) {
			let query = {
				task_id: task._id,
				cardset_id: task.cardset_id,
				"timestamps.submission": {$exists: true}
			};

			if (task.user_id !== undefined) {
				query.user_id = task.user_id;
			} else {
				query.user_id_deleted = task.user_id_deleted;
			}

			let taskHistory = LeitnerHistory.find(query).fetch();
			let milliseconds = [];
			let answerTime = {
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			};
			let workingTime = {
				sum: 0
			};

			for (let i = 0; i < taskHistory.length; i++) {
				milliseconds.push(Math.round((taskHistory[i].timestamps.submission - taskHistory[i].timestamps.question)));
			}

			if (milliseconds.length) {
				answerTime.median = Math.round(Utilities.getMedian(milliseconds));
				answerTime.arithmeticMean = Math.round(Utilities.getArithmeticMean(milliseconds));
				answerTime.standardDeviation = Math.round(Utilities.getStandardDeviation(milliseconds));
				workingTime.sum = Math.round(Utilities.getSum(milliseconds));
			}

			let learningStatistics = {
				answerTime: answerTime,
				workingTime: workingTime
			};

			LeitnerTasks.update({
					_id: task._id
				},
				{
					$set: {
						learningStatistics: learningStatistics
					}
				}
			);

			//Update Session Stats
			if (task.user_id !== undefined) {
				let highestSession = LeitnerTasks.findOne({user_id: task.user_id, cardset_id: task.cardset_id}, {sort: {session: -1}}).session;

				if (task.session === highestSession) {
					let tasks = LeitnerTasks.find({user_id: task.user_id, cardset_id: task.cardset_id, session: highestSession,  "learningStatistics.answerTime.median": {$exists: true}}).fetch();
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

					for (let i = 0; i < tasks.length; i++) {
						if (tasks[i].learningStatistics.answerTime.median > 0) {
							answerTime.median.push(tasks[i].learningStatistics.answerTime.median);
						}
						if (tasks[i].learningStatistics.answerTime.arithmeticMean > 0) {
							answerTime.arithmeticMean.push(tasks[i].learningStatistics.answerTime.arithmeticMean);
						}
						if (tasks[i].learningStatistics.answerTime.standardDeviation > 0) {
							answerTime.standardDeviation.push(tasks[i].learningStatistics.answerTime.standardDeviation);
						}
						if (tasks[i].learningStatistics.workingTime.sum > 0) {
							workingTime.sum.push(tasks[i].learningStatistics.workingTime.sum);
						}
					}
					learningStatistics = {
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
						learningStatistics.answerTime.median = answerTime.median[0];
					} else {
						learningStatistics.answerTime.median = Math.round(Utilities.getMedian(answerTime.median));
					}
					if (answerTime.arithmeticMean.length === 1) {
						learningStatistics.answerTime.arithmeticMean = answerTime.arithmeticMean[0];
					} else {
						learningStatistics.answerTime.arithmeticMean = Math.round(Utilities.getMedian(answerTime.arithmeticMean));
					}
					if (answerTime.standardDeviation.length === 1) {
						learningStatistics.answerTime.standardDeviation = answerTime.standardDeviation[0];
					} else {
						learningStatistics.answerTime.standardDeviation = Math.round(Utilities.getMedian(answerTime.standardDeviation));
					}
					if (workingTime.sum.length === 1) {
						learningStatistics.workingTime.sum = workingTime.sum[0];
						learningStatistics.workingTime.median = workingTime.sum[0];
						learningStatistics.workingTime.arithmeticMean = workingTime.sum[0];
						learningStatistics.workingTime.standardDeviation = 0;
					} else {
						learningStatistics.workingTime.sum = Math.round(Utilities.getSum(workingTime.sum));
						learningStatistics.workingTime.median = Math.round(Utilities.getMedian(workingTime.sum));
						learningStatistics.workingTime.arithmeticMean = Math.round(Utilities.getArithmeticMean(workingTime.sum));
						learningStatistics.workingTime.standardDeviation = Math.round(Utilities.getStandardDeviation(workingTime.sum));
					}

					Workload.update({
							user_id: task.user_id,
							cardset_id: task.cardset_id
						},
						{
							$set: {
								"leitner.learningStatistics": learningStatistics
							}
						}
					);
					let workload = Workload.findOne({
						user_id: task.user_id,
						cardset_id: task.cardset_id
					}, {fields: {"leitner.bonus": 1}});

					if (workload !== undefined) {
						query = {
							cardset_id: task.cardset_id,
							"leitner.learningStatistics": {$exists: true}
						};
						if (workload.leitner !== undefined && workload.leitner.bonus) {
							query["leitner.bonus"] = true;
						}

						let cardsetWorkloads = Workload.find(query).fetch();
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
							if (cardsetWorkloads[i].leitner.learningStatistics.answerTime.median > 0) {
								answerTime.median.push(cardsetWorkloads[i].leitner.learningStatistics.answerTime.median);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.answerTime.arithmeticMean > 0) {
								answerTime.arithmeticMean.push(cardsetWorkloads[i].leitner.learningStatistics.answerTime.arithmeticMean);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.answerTime.standardDeviation > 0) {
								answerTime.standardDeviation.push(cardsetWorkloads[i].leitner.learningStatistics.answerTime.standardDeviation);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.workingTime.median > 0) {
								workingTime.median.push(cardsetWorkloads[i].leitner.learningStatistics.workingTime.median);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.workingTime.arithmeticMean > 0) {
								workingTime.arithmeticMean.push(cardsetWorkloads[i].leitner.learningStatistics.workingTime.arithmeticMean);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.workingTime.standardDeviation > 0) {
								workingTime.standardDeviation.push(cardsetWorkloads[i].leitner.learningStatistics.workingTime.standardDeviation);
							}
							if (cardsetWorkloads[i].leitner.learningStatistics.workingTime.sum > 0) {
								workingTime.sum.push(cardsetWorkloads[i].leitner.learningStatistics.workingTime.sum);
							}
						}
						learningStatistics = {
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
							learningStatistics.answerTime.median = answerTime.median[0];
						} else {
							learningStatistics.answerTime.median = Math.round(Utilities.getMedian(answerTime.median));
						}
						if (answerTime.arithmeticMean.length === 1) {
							learningStatistics.answerTime.arithmeticMean = answerTime.arithmeticMean[0];
						} else {
							learningStatistics.answerTime.arithmeticMean = Math.round(Utilities.getMedian(answerTime.arithmeticMean));
						}
						if (answerTime.standardDeviation.length === 1) {
							learningStatistics.answerTime.standardDeviation = answerTime.standardDeviation[0];
						} else {
							learningStatistics.answerTime.standardDeviation = Math.round(Utilities.getMedian(answerTime.standardDeviation));
						}
						if (workingTime.median.length === 1) {
							learningStatistics.workingTime.median = workingTime.median[0];
						} else {
							learningStatistics.workingTime.median = Math.round(Utilities.getMedian(workingTime.median));
						}
						if (workingTime.arithmeticMean.length === 1) {
							learningStatistics.workingTime.arithmeticMean = workingTime.arithmeticMean[0];
						} else {
							learningStatistics.workingTime.arithmeticMean = Math.round(Utilities.getMedian(workingTime.arithmeticMean));
						}
						if (workingTime.standardDeviation.length === 1) {
							learningStatistics.workingTime.standardDeviation = workingTime.standardDeviation[0];
						} else {
							learningStatistics.workingTime.standardDeviation = Math.round(Utilities.getMedian(workingTime.standardDeviation));
						}
						if (workingTime.sum.length === 1) {
							learningStatistics.workingTime.sum = workingTime.sum[0];
						} else {
							learningStatistics.workingTime.sum = Math.round(Utilities.getSum(workingTime.sum));
						}

						if (workload.leitner.bonus) {
							Cardsets.update({
									_id: task.cardset_id
								},
								{
									$set: {
										"learningStatistics.answerTime.median.bonus": learningStatistics.answerTime.median,
										"learningStatistics.answerTime.arithmeticMean.bonus": learningStatistics.answerTime.arithmeticMean,
										"learningStatistics.answerTime.standardDeviation.bonus": learningStatistics.answerTime.standardDeviation,
										"learningStatistics.workingTime.sum.bonus": learningStatistics.workingTime.sum,
										"learningStatistics.workingTime.median.bonus": learningStatistics.workingTime.median,
										"learningStatistics.workingTime.arithmeticMean.bonus": learningStatistics.workingTime.arithmeticMean,
										"learningStatistics.workingTime.standardDeviation.bonus": learningStatistics.workingTime.standardDeviation
									}
								}
							);
						} else {
							Cardsets.update({
									_id: task.cardset_id
								},
								{
									$set: {
										"learningStatistics.answerTime.median.normal": learningStatistics.answerTime.median,
										"learningStatistics.answerTime.arithmeticMean.normal": learningStatistics.answerTime.arithmeticMean,
										"learningStatistics.answerTime.standardDeviation.normal": learningStatistics.answerTime.standardDeviation,
										"learningStatistics.workingTime.sum.normal": learningStatistics.workingTime.sum,
										"learningStatistics.workingTime.median.normal": learningStatistics.workingTime.median,
										"learningStatistics.workingTime.arithmeticMean.normal": learningStatistics.workingTime.arithmeticMean,
										"learningStatistics.workingTime.standardDeviation.normal": learningStatistics.workingTime.standardDeviation
									}
								}
							);
						}
					}
				}
			}
		}
	}
};
