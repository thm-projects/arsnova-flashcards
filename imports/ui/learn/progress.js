import "../cardset/labels/labels.js";
import "../filter/index/item/bottom/item/deadline.js";
import "../filter/index/item/bottom/item/transcriptRating.js";
import "../filter/index/item/bottom/item/starsRating.js";
import "./progress.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {LearningStatus} from "../../util/learningStatus";
import {CardType} from "../../util/cardTypes";

/*
 * ############################################################################
 * Progress
 * ############################################################################
 */

Template.progress.helpers({
	isProgressType: function (type) {
		return Session.get('workloadProgressType') === type;
	},
	countBox: function (boxId) {
		let leitnerCollection = LearningStatus.getLeitnerCollection();
		if (Session.get('workloadProgressType') === 'cardset') {
			return leitnerCollection.find({
				cardset_id: Session.get('workloadProgressCardsetID'),
				user_id: Session.get('workloadProgressUserID'),
				box: boxId
			}).count();
		} else {
			return leitnerCollection.find({
				user_id: Meteor.userId(),
				box: boxId
			}).count();
		}
	},
	getMaxWorkload: function () {
		let learningPhaseCollection = LearningStatus.getLearningPhaseCollection();
		let maxWorkload = learningPhaseCollection.findOne({cardset_id: Session.get('workloadProgressCardsetID')});
		if (maxWorkload !== undefined && maxWorkload.maxCards !== undefined) {
			if (maxWorkload.maxCards === 1) {
				return TAPi18n.__('bonus.progress.maxWorkload.single', {amount: maxWorkload.maxCards}, Session.get('activeLanguage'));
			} else {
				return TAPi18n.__('bonus.progress.maxWorkload.plural', {amount: maxWorkload.maxCards}, Session.get('activeLanguage'));
			}
		}
		return '';
	},
	getCardsetCardCount: function (countLeitnerCards = false) {
		return LearningStatus.getCardsetCardCount(countLeitnerCards);
	},
	getTotalLeitnerCardCount: function () {
		return LearningStatus.getTotalLeitnerCardCount();
	},
	getTotalLeitnerCardCountUser: function () {
		return LearningStatus.getTotalLeitnerCardCountUser();
	},
	isShuffledCardset: function () {
		let cardsetCollection = LearningStatus.getCardsetCollection();
		let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')}, {fields: {shuffled: 1}});
		if (cardset !== undefined) {
			return cardset.shuffled;
		} else {
			return false;
		}
	},
	getTargetID: function () {
		if (this.type === 'simulator') {
			return 'boxChartSimulator';
		} else {
			return 'boxChart';
		}
	}
});

Template.progress.onRendered(function () {
	LearningStatus.initializeGraph(this.data.type);
	LearningStatus.updateGraphLabels();
	if (this.data.type !== 'simulator') {
		new ResizeSensor($('#boxChart'), function () {
			LearningStatus.updateGraphLabels();
		});
	}
});

/*
 * ############################################################################
 * graphCardsetFilter
 * ############################################################################
 */

Template.graphCardsetFilter.helpers({
	setModalLabelValue: function (data, isModalLabel = false) {
		data.isModalLabel = isModalLabel;
		return data;
	},
	getCardsetCardCount: function (countLeitnerCards = false) {
		return LearningStatus.getCardsetCardCount(countLeitnerCards);
	},
	shuffledData: function () {
		let cardsetCollection = LearningStatus.getCardsetCollection();
		let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
		cardset.useLeitnerCount = true;
		return cardset;
	},
	getCardsetCount: function () {
		let count = 0;
		let cardsetCollection = LearningStatus.getCardsetCollection();
		let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
		for (let i = 0; i < cardset.cardGroups.length; i++) {
			let cardsetGroupItem = cardsetCollection.findOne({_id: cardset.cardGroups[i]}, {fields: {_id: 1, cardType: 1}});
			if (CardType.gotLearningModes(cardsetGroupItem.cardType)) {
				count++;
			}
		}
		return count;
	}
});
Template.graphCardsetFilter.events({
	'click .cardset': function (evt) {
		let cardset_id = $(evt.currentTarget).attr("data-id");
		let count = $(evt.currentTarget).attr("data-count");
		let cardset_name = $(evt.currentTarget).attr("data-name");
		if (cardset_id === "-1") {
			$('#setCardsetFilter').html(TAPi18n.__('learningStatistics.indexDefault', {cardsetCount: cardset_name, cardCount: count}, Session.get('activeLanguage')));
		} else {
			$('#setCardsetFilter').html(TAPi18n.__('learningStatistics.index', {cardset: cardset_name, cardCount: count}, Session.get('activeLanguage')));
		}
		$('#setCardsetFilter').val(cardset_id);
		LearningStatus.updateGraph(cardset_id);
	}
});
