//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./log.js";
import "../item/sort.js";
import "./history.html";
import * as config from "../../../config/learningHistory.js";
import {Utilities} from "../../../util/utilities";
import {Route} from "../../../util/route";
import {LeitnerHistoryUtilities} from "../../../util/learningHistory";

Session.setDefault('learningHistoryModalActive', false);

Template.learningHistoryModal.onRendered(function () {
	$('#learningHistoryModal').on('show.bs.modal', function () {
		Session.set('sortBonusUserHistory', config.defaultUserHistorySortSettings);
	});
	$('#learningHistoryModal').on('shown.bs.modal', function () {
		Session.set('learningHistoryModalActive', true);
	});
	$('#learningHistoryModal').on('hidden.bs.modal', function () {
		Session.set('learningHistoryModalActive', false);
		Session.set('selectedLearningStatisticsUser', undefined);
		Session.set('selectedLearningHistory', undefined);
	});
});

Template.learningHistoryModal.helpers({
	gotUserData: function () {
		if (Route.isFilterIndex() || Route.isBox()) {
			return true;
		} else {
			return Session.get('selectedLearningStatisticsUser') !== undefined && Session.get('selectedLearningStatisticsUser').user_id !== undefined;
		}
	},
	gotHistoryData: function () {
		return Session.get('selectedLearningHistory') !== undefined;
	},
	getWorkloadHistory: function () {
		return Session.get('selectedLearningHistory');
	},
	getTaskCount: function (reason = undefined) {
		let historyData = Session.get('selectedLearningHistory');
		if (reason === undefined) {
			return historyData.length;
		} else {
			let filterResult = historyData.filter(task => {
				if (reason === 0) {
					return task.workload === (task.known + task.notKnown);
				} else {
					return task.workload !== (task.known + task.notKnown);
				}
			});
			if (historyData.length && reason === 1 && !historyData[0].missedDeadline && ((historyData[0].known + historyData[0].notKnown) !== historyData[0].workload)) {
				return `${filterResult.length} (${TAPi18n.__('learningHistory.stats.tasks.inProgress')})`;
			} else {
				return filterResult.length;
			}
		}
	},
	getWorkloadCount: function (type = 0) {
		let historyData = Session.get('selectedLearningHistory');
		let workloadCount = 0;
		switch (type) {
			case 1:
				workloadCount = historyData.map(function (task) {
					return task.known;
				}).reduce((a, b) => a + b, 0);
				break;
			case 2:
				workloadCount = historyData.map(function (task) {
					return task.notKnown;
				}).reduce((a, b) => a + b, 0);
				break;
			case 0:
			default:
				workloadCount = historyData.map(function (task) {
					return task.known + task.notKnown;
				}).reduce((a, b) => a + b, 0);
				break;
		}
		if (workloadCount === 1) {
			return TAPi18n.__('learningHistory.table.workload.singular', {cards: workloadCount});
		} else if (workloadCount !== 0) {
			return TAPi18n.__('learningHistory.table.workload.plural', {cards: workloadCount});
		}
	},
	getTotalDuration: function () {
		let historyData = Session.get('selectedLearningHistory');
		let duration = historyData.map(function (task) {
			return task.duration;
		}).reduce((a, b) => a + b, 0);
		return Utilities.humanizeDuration(duration);
	},
	getAverageDuration: function () {
		let historyData = Session.get('selectedLearningHistory');
		let duration = [];
		historyData.forEach(function (item) {
			if (item.duration !== 0) {
				duration.push(item.duration);
			}
		});
		let avgDuration = duration.reduce((a,b) => a + b, 0) / duration.length;
		return Utilities.humanizeDuration(avgDuration);
	},
	getUserCardsArithmeticMean: function () {
		let historyData = Session.get('selectedLearningHistory');
		return Utilities.humanizeDuration(historyData[0].userCardArithmeticMean);
	},
	getUserCardsStandardDeviation: function () {
		let historyData = Session.get('selectedLearningHistory');
		return Utilities.humanizeDuration(historyData[0].userCardStandardDeviation);
	},
	getUserCardMedian: function () {
		let historyData = Session.get('selectedLearningHistory');
		return Utilities.humanizeDuration(historyData[0].userCardMedian);
	},
	getAverageScore: function () {
		let historyData = Session.get('selectedLearningHistory');
		let score = [];
		historyData.forEach(function (item) {
			if (item.known) {
				let result = (item.known / item.workload) * 100;
				score.push(result);
			} else if (item.notKnown) {
				score.push(0);
			}
		});
		let average = Math.trunc(score.reduce((a,b) => a + b, 0) / score.length);
		if (isNaN(average)) {
			average = 0;
		}
		return average + "%";
	},
	getReason: function () {
		if (this.reason === 0) {
			return TAPi18n.__('learningHistory.table.reason.leitner');
		} else {
			return TAPi18n.__('learningHistory.table.reason.deadline');
		}
	},
	getWorkload: function () {
		if (this.workload === 1) {
			return TAPi18n.__('learningHistory.table.workload.singular', {cards: this.workload});
		} else {
			return TAPi18n.__('learningHistory.table.workload.plural', {cards: this.workload});
		}
	},
	getDuration: function (duration = 0) {
		return Utilities.humanizeDuration(duration);
	},
	canDisplayTaskHistory: function () {
		return this.known > 0 || this.notKnown > 0;
	},
	setSortObject: function (content) {
		return {
			type: 1,
			content: content
		};
	}
});

Template.learningHistoryModal.events({
	"click .showLearningLog": function (event) {
		let task = {};
		let taskStats = {};
		task.user_id = $(event.target).data('user');
		task.cardset_id = $(event.target).data('cardset');
		task.task_id = $(event.target).data('task');

		taskStats.known = $(event.target).data('known');
		taskStats.notKnown = $(event.target).data('notknown');
		taskStats.workload = $(event.target).data('workload');
		taskStats.reason = $(event.target).data('reason');
		taskStats.duration = $(event.target).data('duration');
		taskStats.cardArithmeticMean = $(event.target).data('cardarithmeticmean');
		taskStats.cardMedian = $(event.target).data('cardmedian');
		taskStats.cardStandardDeviation = $(event.target).data('cardstandarddeviation');
		taskStats.lastActivity = $(event.target).data('lastActivity');
		Session.set('selectedLearningLogStats', taskStats);
		Meteor.call("getLearningLog", task.user_id, task.cardset_id, task.task_id, function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for task history');
			}
			if (result) {
				Session.set('selectedLearningLog', LeitnerHistoryUtilities.prepareTaskHistoryData(result));
			}
		});
	},
	"click .sort-bonus-user-history": function (event) {
		let sortSettings = Session.get('sortBonusUserHistory');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('selectedLearningHistory', Utilities.sortArray(Session.get('selectedLearningHistory'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUserHistory', sortSettings);
	}
});
