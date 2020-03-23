//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./userHistory.html";
import {Utilities} from "../../../../../api/utilities";

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
		return TAPi18n.__('leitnerProgress.modal.userHistory.title', {lastName: Session.get('selectedBonusUser').lastName, firstName: Session.get('selectedBonusUser').firstName});
	},
	gotUserData: function () {
		return Session.get('selectedBonusUser') !== undefined && Session.get('selectedBonusUser').user_id !== undefined;
	},
	gotHistoryData: function () {
		return Session.get('selectedBonusUserHistoryData') !== undefined;
	},
	getWorkloadHistory: function () {
		return Session.get('selectedBonusUserHistoryData');
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
	}
});
