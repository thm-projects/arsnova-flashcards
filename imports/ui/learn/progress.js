import "../cardset/labels/labels.js";
import "../filter/index/item/bottom/deadline.js";
import "../filter/index/item/bottom/transcriptRating.js";
import "../filter/index/item/bottom/starsRating.js";
import "./progress.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {LeitnerProgress} from "../../api/leitnerProgress";
import {CardType} from "../../api/cardTypes";

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
		let leitnerCollection = LeitnerProgress.getLeitnerCollection();
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
		let cardsetCollection = LeitnerProgress.getCardsetCollection();
		let maxWorkload = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')}).maxCards;
		if (maxWorkload === 1) {
			return TAPi18n.__('bonus.progress.maxWorkload.single', {amount: maxWorkload}, Session.get('activeLanguage'));
		} else {
			return TAPi18n.__('bonus.progress.maxWorkload.plural', {amount: maxWorkload}, Session.get('activeLanguage'));
		}
	},
	getCardsetCardCount: function (countLeitnerCards = false) {
		return LeitnerProgress.getCardsetCardCount(countLeitnerCards);
	},
	getTotalLeitnerCardCount: function () {
		return LeitnerProgress.getTotalLeitnerCardCount();
	},
	getTotalLeitnerCardCountUser: function () {
		return LeitnerProgress.getTotalLeitnerCardCountUser();
	},
	isShuffledCardset: function () {
		let cardsetCollection = LeitnerProgress.getCardsetCollection();
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
	LeitnerProgress.initializeGraph(this.data.type);
	LeitnerProgress.updateGraphLabels();
	if (this.data.type !== 'simulator') {
		new ResizeSensor($('#boxChart'), function () {
			LeitnerProgress.updateGraphLabels();
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
		return LeitnerProgress.getCardsetCardCount(countLeitnerCards);
	},
	shuffledData: function () {
		let cardsetCollection = LeitnerProgress.getCardsetCollection();
		let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
		cardset.useLeitnerCount = true;
		return cardset;
	},
	getCardsetCount: function () {
		let count = 0;
		let cardsetCollection = LeitnerProgress.getCardsetCollection();
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
			$('#setCardsetFilter').html(TAPi18n.__('leitnerProgress.indexDefault', {cardsetCount: cardset_name, cardCount: count}, Session.get('activeLanguage')));
		} else {
			$('#setCardsetFilter').html(TAPi18n.__('leitnerProgress.index', {cardset: cardset_name, cardCount: count}, Session.get('activeLanguage')));
		}
		$('#setCardsetFilter').val(cardset_id);
		LeitnerProgress.updateGraph(cardset_id);
	}
});
