//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./taskHistory.js";
import "../item/sort.js";
import "./userHistory.html";
import * as config from "../../../../../config/leitnerHistory.js";
import {Utilities} from "../../../../../util/utilities";
import {Route} from "../../../../../util/route";
import {LeitnerHistoryUtilities} from "../../../../../util/leitnerHistory";

Session.setDefault('bonusUserHistoryModalActive', false);

/*
* ############################################################################
* bonusUserHistoryModal
* ############################################################################
*/

Template.bonusUserHistoryModal.onRendered(function () {
	$('#bonusUserHistoryModal').on('show.bs.modal', function () {
		Session.set('sortBonusUserHistory', config.defaultUserHistorySortSettings);
	});
	$('#bonusUserHistoryModal').on('shown.bs.modal', function () {
		Session.set('bonusUserHistoryModalActive', true);
	});
	$('#bonusUserHistoryModal').on('hidden.bs.modal', function () {
		Session.set('bonusUserHistoryModalActive', false);
		Session.set('selectedBonusUser', undefined);
		Session.set('selectedBonusUserHistoryData', undefined);
	});
});

Template.bonusUserHistoryModal.helpers({
	getTitle: function () {
		if (Session.get('selectedBonusUserHistoryData') !== undefined) {
			if (Route.isFilterIndex() || Route.isBox()) {
				if (Session.get('selectedBonusUserHistoryData')[0].cardsetShuffled) {
					return TAPi18n.__('leitnerProgress.modal.userHistory.titleRepetitorium', {repetitorium: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle});
				} else {
					return TAPi18n.__('leitnerProgress.modal.userHistory.titleCardset', {cardset: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle});
				}
			} else {
				if (Session.get('hideUserNames')) {
					let hiddenUser = TAPi18n.__('leitnerProgress.hiddenUserPlaceholder', {index: Session.get('selectedBonusUser').index});
					return TAPi18n.__('leitnerProgress.modal.userHistory.titleHiddenUser', {hiddenUser: hiddenUser});
				} else {
					return TAPi18n.__('leitnerProgress.modal.userHistory.title', {lastName: Session.get('selectedBonusUser').lastName, firstName: Session.get('selectedBonusUser').firstName});
				}
			}
		}
	},
	gotUserData: function () {
		if (Route.isFilterIndex() || Route.isBox()) {
			return true;
		} else {
			return Session.get('selectedBonusUser') !== undefined && Session.get('selectedBonusUser').user_id !== undefined;
		}
	},
	gotHistoryData: function () {
		return Session.get('selectedBonusUserHistoryData') !== undefined;
	},
	getWorkloadHistory: function () {
		return Session.get('selectedBonusUserHistoryData');
	},
	getTaskCount: function (reason = undefined) {
		let historyData = Session.get('selectedBonusUserHistoryData');
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
				return `${filterResult.length} (${TAPi18n.__('leitnerProgress.modal.userHistory.stats.tasks.inProgress')})`;
			} else {
				return filterResult.length;
			}
		}
	},
	getWorkloadCount: function (type = 0) {
		let historyData = Session.get('selectedBonusUserHistoryData');
		let workloadCount = 0;
		switch (type) {
			case 0:
			default:
				workloadCount = historyData.map(function (task) {
					return task.known + task.notKnown;
				}).reduce((a, b) => a + b, 0);
				break;
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
		}
		if (workloadCount === 1) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.singular', {cards: workloadCount});
		} else if (workloadCount !== 0) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.plural', {cards: workloadCount});
		}
	},
	getTotalDuration: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
		let duration = historyData.map(function (task) {
			return task.duration;
		}).reduce((a, b) => a + b, 0);
		return Utilities.humanizeDuration(duration);
	},
	getAverageDuration: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
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
		let historyData = Session.get('selectedBonusUserHistoryData');
		return Utilities.humanizeDuration(historyData[0].userCardArithmeticMean);
	},
	getUserCardsStandardDeviation: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
		return Utilities.humanizeDuration(historyData[0].userCardStandardDeviation);
	},
	getUserCardMedian: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
		return Utilities.humanizeDuration(historyData[0].userCardMedian);
	},
	getAverageScore: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
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
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.reason.leitner');
		} else {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.reason.deadline');
		}
	},
	getWorkload: function () {
		if (this.workload === 1) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.singular', {cards: this.workload});
		} else {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.plural', {cards: this.workload});
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

Template.bonusUserHistoryModal.events({
	"click .showBonusTaskHistory": function (event) {
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
		Session.set('selectedBonusTaskHistoryStats', taskStats);
		Meteor.call("getLearningTaskHistoryData", task.user_id, task.cardset_id, task.task_id, function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for task history');
			}
			if (result) {
				Session.set('selectedBonusTaskHistoryData', LeitnerHistoryUtilities.prepareTaskHistoryData(result));
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
		Session.set('selectedBonusUserHistoryData', Utilities.sortArray(Session.get('selectedBonusUserHistoryData'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUserHistory', sortSettings);
	}
});
