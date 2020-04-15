import {LeitnerTasks} from "../../../../api/subscriptions/leitnerTasks";
import './leitnerTimer.html';
import {ServerStyle} from "../../../../api/styles";

/*
 * ############################################################################
 * mainOverlaysDebugLeitnerItem
 * ############################################################################
 */

Template.mainOverlaysDebugLeitnerItem.helpers({
	getWorkloadTimer: function () {
		let leitnerTask = LeitnerTasks.findOne({}, {sort: {createdAt: -1}});
		let time = 0;
		if (leitnerTask !== undefined && leitnerTask.workloadTimer !== undefined) {
			time = leitnerTask.workloadTimer;
		}
		return TAPi18n.__('overlays.debugLeitnerTimer.minutes', {count: time}, ServerStyle.getServerLanguage());
	},
	getBreakTimer: function () {
		let leitnerTask = LeitnerTasks.findOne({}, {sort: {createdAt: -1}});
		let time = 0;
		if (leitnerTask !== undefined && leitnerTask.breakTimer !== undefined) {
			time = leitnerTask.breakTimer;
		}
		return TAPi18n.__('overlays.debugLeitnerTimer.minutes', {count: time}, ServerStyle.getServerLanguage());
	},
	getStatus: function () {
		return TAPi18n.__('overlays.debugLeitnerTimer.status.runningWorkload', ServerStyle.getServerLanguage());
	}
});
