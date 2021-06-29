import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";
import {Utilities} from "./utilities";

export let LearningCardStats = class LearningCardStats {
	static calculateUserCardStats (card_id, workload_id, user_id) {
		let stats = {
			answers: {
				known: 0,
				notKnown: 0,
				skipped: 0
			},
			workingTime: {
				sum: 0,
				median: 0,
				arithmeticMean: 0,
				standardDeviation: 0
			}
		};
		let workingTimeArray = [];
		const performanceHistory = LeitnerPerformanceHistory.find({
			card_id: card_id,
			workload_id: workload_id,
			user_id: user_id
		}, {fields: {timestamps: 1, answer: 1, skipped: 1}}).fetch();
		performanceHistory.forEach(history => {
			if (history.answer === 0) {
				stats.answers.known += 1;
			} else {
				stats.answers.notKnown += 1;
			}
			stats.answers.skipped += history.skipped;

			// Cards which got marked as notKnown by the deadline event don't have a timestamp object
			if (history.timestamps !== undefined) {
				let workingTime;
				if (history.timestamps.submission === undefined) {
					workingTime = history.timestamps.answer.getTime() - history.timestamps.question.getTime();
				} else {
					workingTime = history.timestamps.submission.getTime() - history.timestamps.question.getTime();
				}
				workingTimeArray.push(workingTime);
			}
		});
		stats.workingTime.sum = Math.round(Utilities.getSum(workingTimeArray));
		stats.workingTime.median = Math.round(Utilities.getMedian(workingTimeArray));
		stats.workingTime.arithmeticMean = Math.round(Utilities.getArithmeticMean(workingTimeArray));
		stats.workingTime.standardDeviation = Math.round(Utilities.getStandardDeviation(workingTimeArray));
		return stats;
	}
};
