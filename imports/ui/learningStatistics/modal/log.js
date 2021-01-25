import "./log.html";
import "../item/sort.js";
import {Session} from "meteor/session";
import {Route} from "../../../util/route";
import {Utilities} from "../../../util/utilities";
import * as config from "../../../config/learningHistory";

Template.learningLogModal.onRendered(function () {
	$('#learningLogModal').on('show.bs.modal', function () {
		Session.set('sortBonusUserTaskHistory', config.defaultTaskHistorySortSettings);
	});
	$('#learningLogModal').on('shown.bs.modal', function () {
		Session.set('learningLogModalActive', true);
	});
	$('#learningLogModal').on('hidden.bs.modal', function () {
		Session.set('learningLogModalActive', false);
		Session.set('selectedLearningLog', undefined);
	});
});

Template.learningLogModal.helpers({
	gotUserData: function () {
		if (Route.isFilterIndex() || Route.isBox()) {
			return true;
		} else {
			return Session.get('selectedLearningStatisticsUser') !== undefined && Session.get('selectedLearningStatisticsUser').user_id !== undefined;
		}
	},
	getTitle: function () {
		if (Session.get('selectedLearningHistory') !== undefined) {
			let date =  Utilities.getMomentsDate(Session.get('selectedLearningHistory').createdAt, false, 0, false);
			return TAPi18n.__('learningLog.title', {date: date});
		}
	},
	gotTaskHistoryStats: function () {
		return Session.get('selectedLearningLogStats') !== undefined && Session.get('selectedLearningLogStats').known !== undefined;
	},
	gotTaskHistoryData: function () {
		return Session.get('selectedLearningLog') !== undefined && Session.get('selectedLearningLog')[0].user_id !== undefined;
	},
	getTaskHistoryData: function () {
		return Session.get('selectedLearningLog');
	},
	getTaskHistoryStats: function () {
		return Session.get('selectedLearningLogStats');
	},
	getAnswer: function () {
		if (this.answer) {
			return TAPi18n.__('learningLog.table.notKnown');
		} else {
			return TAPi18n.__('learningLog.table.known');
		}
	},
	getWorkloadCount: function (cards = 0) {
		if (cards === 1) {
			return TAPi18n.__('learningHistory.table.workload.singular', {cards: cards});
		} else {
			return TAPi18n.__('learningHistory.table.workload.plural', {cards: cards});
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

Template.learningLogModal.events({
	"click .sort-bonus-user-task-history": function (event) {
		let sortSettings = Session.get('sortBonusUserTaskHistory');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('selectedLearningLog', Utilities.sortArray(Session.get('selectedLearningLog'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUserTaskHistory', sortSettings);
	}
});
