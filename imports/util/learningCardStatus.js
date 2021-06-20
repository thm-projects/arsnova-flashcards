import {LeitnerPerformanceHistory} from "../api/subscriptions/leitner/leitnerPerformanceHistory";

export let LearningCardStats = class LearningCardStats {
	static calculateUserCardStats (card_id, workload_id, user_id) {
		let stats = {
			answers: {
				known: 0,
				notKnown: 0
			},
			totalTime: 0
		};
		const performanceHistory = LeitnerPerformanceHistory.find({
			card_id: card_id,
			workload_id: workload_id,
			user_id: user_id
		}, {fields: {timestamps: 1, answer: 1}}).fetch();
		performanceHistory.forEach(history => {
			if (history.answer === 0) {
				stats.answers.known += 1;
			} else {
				stats.answers.notKnown += 1;
			}

			// Cards which got marked as notKnown by the deadline event don't have a timestamp object
			if (history.timestamps !== undefined) {
				stats.totalTime += history.timestamps.submission - history.timestamps.question;
			}
		});
		return stats;
	}
};
