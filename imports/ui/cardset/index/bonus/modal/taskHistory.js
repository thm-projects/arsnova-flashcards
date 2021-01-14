import "./taskHistory.html";
import "../item/sort.js";
import {Session} from "meteor/session";
import {Route} from "../../../../../util/route";
import {Utilities} from "../../../../../util/utilities";
import * as config from "../../../../../config/leitnerHistory";

Template.bonusTaskHistoryModal.onRendered(function () {
	$('#bonusTaskHistoryModal').on('show.bs.modal', function () {
		Session.set('sortBonusUserTaskHistory', config.defaultTaskHistorySortSettings);
	});
	$('#bonusTaskHistoryModal').on('shown.bs.modal', function () {
		Session.set('bonusTaskHistoryModalActive', true);
	});
	$('#bonusTaskHistoryModal').on('hidden.bs.modal', function () {
		Session.set('bonusTaskHistoryModalActive', false);
		Session.set('selectedBonusTaskHistoryData', undefined);
	});
});

Template.bonusTaskHistoryModal.helpers({
	gotUserData: function () {
		if (Route.isFilterIndex() || Route.isBox()) {
			return true;
		} else {
			return Session.get('selectedBonusUser') !== undefined && Session.get('selectedBonusUser').user_id !== undefined;
		}
	},
	getTitle: function () {
		if (Session.get('selectedBonusUserHistoryData') !== undefined) {
			let date =  Utilities.getMomentsDate(Session.get('selectedBonusUserHistoryData').createdAt, false, 0, false);
			if (Session.get('hideUserNames') && Route.isCardsetLeitnerStats()) {
				let hiddenUser = TAPi18n.__('leitnerProgress.hiddenUserPlaceholder', {index: Session.get('selectedBonusUser').index});
				return TAPi18n.__('leitnerProgress.modal.taskHistory.titleHiddenUser', {cardset: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle, hiddenUser: hiddenUser, date: date});
			} else {
				return TAPi18n.__('leitnerProgress.modal.taskHistory.title', {cardset: Session.get('selectedBonusUserHistoryData')[0].cardsetTitle, lastName: Session.get('selectedBonusUser').lastName, firstName: Session.get('selectedBonusUser').firstName, date: date});
			}
		}
	},
	gotTaskHistoryStats: function () {
		return Session.get('selectedBonusTaskHistoryStats') !== undefined && Session.get('selectedBonusTaskHistoryStats').known !== undefined;
	},
	gotTaskHistoryData: function () {
		return Session.get('selectedBonusTaskHistoryData') !== undefined && Session.get('selectedBonusTaskHistoryData')[0].user_id !== undefined;
	},
	getTaskHistoryData: function () {
		return Session.get('selectedBonusTaskHistoryData');
	},
	getTaskHistoryStats: function () {
		return Session.get('selectedBonusTaskHistoryStats');
	},
	getAnswer: function () {
		if (this.answer) {
			return TAPi18n.__('leitnerProgress.modal.taskHistory.table.notKnown');
		} else {
			return TAPi18n.__('leitnerProgress.modal.taskHistory.table.known');
		}
	},
	getWorkloadCount: function (cards = 0) {
		if (cards === 1) {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.singular', {cards: cards});
		} else {
			return TAPi18n.__('leitnerProgress.modal.userHistory.table.workload.plural', {cards: cards});
		}
	},
	getScore: function () {
		return Math.trunc((this.known / this.workload) * 100) + "%";
	},
	setSortObject: function (content) {
		return {
			type: 2,
			content: content
		};
	}
});

Template.bonusTaskHistoryModal.events({
	"click .sort-bonus-user-task-history": function (event) {
		let sortSettings = Session.get('sortBonusUserTaskHistory');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('selectedBonusTaskHistoryData', Utilities.sortArray(Session.get('selectedBonusTaskHistoryData'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUserTaskHistory', sortSettings);
	}
});
