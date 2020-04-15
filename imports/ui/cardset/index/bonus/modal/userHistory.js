//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./userHistory.html";
import {Utilities} from "../../../../../api/utilities";
import {Route} from "../../../../../api/route";
import humanizeDuration from "humanize-duration";

let humanizeSettings = {language: 'de', conjunction: ' und ', serialComma: false, round: true};

/*
* ############################################################################
* bonusUserHistoryModal
* ############################################################################
*/

Template.bonusUserHistoryModal.onRendered(function () {
	$('#bonusUserHistoryModal').on('hidden.bs.modal', function () {
		Session.set('selectedBonusUser', undefined);
		Session.set('selectedBonusUserHistoryData', undefined);
	});
});

Template.bonusUserHistoryModal.helpers({
	getTitle: function () {
		if (Session.get('selectedBonusUserHistoryData') !== undefined) {
			if (Route.isFilterIndex()) {
				if (Session.get('selectedBonusUserHistoryData')[0].cardsetShuffled) {
					return TAPi18n.__('leitnerProgress.modal.userHistory.titleRepetitorium', {repetitorium: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle});
				} else {
					return TAPi18n.__('leitnerProgress.modal.userHistory.titleCardset', {cardset: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle});
				}
			} else {
				return TAPi18n.__('leitnerProgress.modal.userHistory.title', {lastName: Session.get('selectedBonusUser').lastName, firstName: Session.get('selectedBonusUser').firstName});
			}
		}
	},
	gotUserData: function () {
		if (Route.isFilterIndex()) {
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
			return historyData.filter(task => {
				if (reason === 0) {
					return task.workload === (task.known + task.notKnown);
				} else {
					return task.workload !== (task.known + task.notKnown);
				}
			}).length;
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
		let settings = humanizeSettings;
		let duration = historyData.map(function (task) {
			return task.duration;
		}).reduce((a, b) => a + b, 0);
		if (duration > 0) {
			if (duration < 60000) {
				settings.units = ['s'];
				return humanizeDuration(duration, settings);
			} else {
				settings.units = ['h', 'm'];
				return humanizeDuration(duration, settings);
			}
		}
	},
	getAverageDuration: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
		let settings = humanizeSettings;
		let duration = [];
		historyData.forEach(function (item) {
			if (item.duration !== 0) {
				duration.push(item.duration);
			}
		});
		let avgDuration = duration.reduce((a,b) => a + b, 0) / duration.length;
		if (avgDuration > 0) {
			if (avgDuration < 60000) {
				settings.units = ['s'];
				return humanizeDuration(avgDuration, settings);
			} else {
				settings.units = ['h', 'm'];
				return humanizeDuration(avgDuration, settings);
			}
		}
	},
	getAverageScore: function () {
		let historyData = Session.get('selectedBonusUserHistoryData');
		let score = [];
		historyData.forEach(function (item) {
			if (item.known) {
				let result = item.known / item.workload * 100;
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
	getStatus: function () {
		let completedWorkload = this.known + this.notKnown;
		if (completedWorkload === this.workload) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.status.completed', {lastAnswerDate: Utilities.getMomentsDate(this.lastAnswerDate, 0, false, false)});
		} else if (!this.missedDeadline) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.status.inProgress');
		} else {
			if (completedWorkload > 0) {
				let unfinishedWorkload = this.workload - completedWorkload;
				if (unfinishedWorkload === 1) {
					return TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notFullyCompletedSingular', {cards: unfinishedWorkload});
				} else {
					return TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notFullyCompletedPlural', {cards: unfinishedWorkload});
				}
			} else {
				return TAPi18n.__('leitnerProgress.modal.userHistory.table.status.notCompleted');
			}
		}
	},
	getDuration: function (duration = 0) {
		let settings = humanizeSettings;
		if (duration > 0) {
			if (duration < 60000) {
				settings.units = ['s'];
				return humanizeDuration(duration, settings);
			} else {
				settings.units = ['h', 'm'];
				return humanizeDuration(duration, settings);
			}
		}
	}
});
