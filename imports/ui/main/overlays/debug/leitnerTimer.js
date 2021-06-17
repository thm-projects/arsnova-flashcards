import {LeitnerActivationDay} from "../../../../api/subscriptions/leitner/leitnerActivationDay";
import './leitnerTimer.html';
import {ServerStyle} from "../../../../util/styles";

/*
 * ############################################################################
 * mainOverlaysDebugLeitnerItem
 * ############################################################################
 */

Template.mainOverlaysDebugLeitnerItem.helpers({
	getWorkloadTimer: function () {
		let leitnerTask = LeitnerActivationDay.findOne({}, {sort: {createdAt: -1}});
		let time = 0;
		if (leitnerTask !== undefined && leitnerTask.timer.workload !== undefined) {
			time = leitnerTask.timer.workload.current;
		}
		return TAPi18n.__('overlays.debugLeitnerTimer.minutes', {count: time}, ServerStyle.getServerLanguage());
	},
	getBreakTimer: function () {
		let leitnerTask = LeitnerActivationDay.findOne({}, {sort: {createdAt: -1}});
		let time = 0;
		if (leitnerTask !== undefined && leitnerTask.timer.break !== undefined) {
			time = leitnerTask.timer.break.current;
		}
		return TAPi18n.__('overlays.debugLeitnerTimer.minutes', {count: time}, ServerStyle.getServerLanguage());
	},
	getWorkloadsCompleted: function () {
		let leitnerTask = LeitnerActivationDay.findOne({}, {sort: {createdAt: -1}});
		let completed = 0;
		if (leitnerTask !== undefined && leitnerTask.timer.workload !== undefined) {
			completed = leitnerTask.timer.workload.completed;
		}
		return completed;
	},
	getBreaksCompleted: function () {
		let leitnerTask = LeitnerActivationDay.findOne({}, {sort: {createdAt: -1}});
		let completed = 0;
		if (leitnerTask !== undefined && leitnerTask.timer.break !== undefined) {
			completed = leitnerTask.timer.break.completed;
		}
		return completed;
	},
	getStatus: function () {
		let leitnerTask = LeitnerActivationDay.findOne({}, {sort: {createdAt: -1}});
		if (leitnerTask !== undefined && leitnerTask.timer.status !== undefined) {
			switch (leitnerTask.timer.status) {
				case 0:
					return TAPi18n.__('overlays.debugLeitnerTimer.status.runningWorkload', ServerStyle.getServerLanguage());
				case 1:
					return TAPi18n.__('overlays.debugLeitnerTimer.status.waitingForBreak', ServerStyle.getServerLanguage());
				case 2:
					return TAPi18n.__('overlays.debugLeitnerTimer.status.runningBreak', ServerStyle.getServerLanguage());
				case 3:
					return TAPi18n.__('overlays.debugLeitnerTimer.status.waitingForWorkload', ServerStyle.getServerLanguage());
			}
		}
	}
});
