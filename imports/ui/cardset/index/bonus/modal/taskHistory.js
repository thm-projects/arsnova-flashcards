import "./taskHistory.html";
import {Session} from "meteor/session";
import {Route} from "../../../../../util/route";
import {Utilities} from "../../../../../util/utilities";
import {CardType} from "../../../../../util/cardTypes";
import {CardVisuals} from "../../../../../util/cardVisuals";
import * as config from "../../../../../config/leitnerStatistics";

Template.bonusTaskHistoryModal.onRendered(function () {
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
	getTime: function () {
		return this.timestamps.submission - this.timestamps.question;
	},
	getAnswer: function () {
		if (this.answer) {
			return TAPi18n.__('leitnerProgress.modal.taskHistory.table.notKnown');
		} else {
			return TAPi18n.__('leitnerProgress.modal.taskHistory.table.known');
		}
	},
	getQuestion: function () {
		if (this.cardData.answers !== undefined && this.cardData.answers.question !== undefined) {
			return this.cardData.answers.question;
		} else {
			return "";
		}
	},
	getText: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardData.cardType);
		switch (cubeSides[0].contentId) {
			case 1:
				return this.cardData.front;
			case 2:
				return this.cardData.back;
			case 3:
				return this.cardData.hint;
			case 4:
				return this.cardData.lecture;
			case 5:
				return this.cardData.top;
			case 6:
				return this.cardData.bottom;
		}
	},
	cleanContent: function (text) {
		text = CardVisuals.removeMarkdeepTags(text);
		if (text.length > config.maxTaskHistoryContentLength) {
			return text.substr(0, config.maxTaskHistoryContentLength) +  '...';
		} else {
			return text;
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
	}
});
