import "./cardStatus.html";
import "../item/sort.js";
import {Session} from "meteor/session";
import {Utilities} from "../../../util/utilities";
import * as config from "../../../config/learningHistory";

Template.learningCardStatusModal.onRendered(function () {
	$('#learningCardStatusModal').on('show.bs.modal', function () {
		Session.set('sortUserCardStats', config.defaultCardStatsSettings);
	});
	$('#learningCardStatusModal').on('shown.bs.modal', function () {
		Session.set('learningCardStatsModalActive', true);
	});
	$('#learningCardStatusModal').on('hidden.bs.modal', function () {
		Session.set('learningCardStatsModalActive', false);
		Session.set('selectedLearningCardStats', undefined);
	});
});

Template.learningCardStatusModal.helpers({
	gotUserData: function () {
		return true;
	},
	isUser: function () {
		return Session.get('selectedLearningCardStats') !== undefined && Session.get('selectedLearningCardStats').length && !Session.get('selectedLearningCardStats')[0].isBonusStats;
	},
	getTitle: function () {
		if (Session.get('selectedLearningCardStats') !== undefined && Session.get('selectedLearningCardStats').length && Session.get('selectedLearningCardStats')[0].isBonusStats) {
			return TAPi18n.__('learningCardStats.titleBonus');
		} else {
			return TAPi18n.__('learningCardStats.title');
		}
	},
	gotCardStatsData: function () {
		return Session.get('selectedLearningCardStats') !== undefined && Session.get('selectedLearningCardStats')[0].card_id !== undefined;
	},
	getCardStatsData: function () {
		return Session.get('selectedLearningCardStats');
	},
	setSortObject: function (content) {
		return {
			type: 3,
			content: content
		};
	},
	getBoxProgress: function (box) {
		if (box === 6) {
			return TAPi18n.__('learningStatistics.learned');
		} else {
			return TAPi18n.__('learningStatistics.box', {number: box});
		}
	},
	getKnownPercent: function () {
		return this.percent + " %";
	}
});

Template.learningCardStatusModal.events({
	"click .sort-card-status": function (event) {
		let sortSettings = Session.get('sortUserCardStats');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('selectedLearningCardStats', Utilities.sortArray(Session.get('selectedLearningCardStats'), sortSettings.content, sortSettings.desc));
		Session.set('sortUserCardStats', sortSettings);
	}
});
