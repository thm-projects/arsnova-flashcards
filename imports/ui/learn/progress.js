import "../cardset/labels/labels.js";
import "../filter/index/item/bottom/deadline.js";
import "../filter/index/item/bottom/transcriptRating.js";
import "../filter/index/item/bottom/starsRating.js";
import "./progress.html";
import {Leitner} from "../../api/subscriptions/leitner.js";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {getAuthorName} from "../../api/userdata";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {LeitnerProgress} from "../../api/leitnerProgress";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {CardType} from "../../api/cardTypes";
import {Route} from "../../api/route";
import {UserPermissions} from "../../api/permissions";

/*
 * ############################################################################
 * Graph
 * ############################################################################
 */

Template.graph.helpers({
	countBox: function (boxId) {
		if (FlowRouter.getRouteName() === "progress") {
			return Leitner.find({
				cardset_id: FlowRouter.getParam('_id'),
				user_id: FlowRouter.getParam('user_id'),
				box: boxId
			}).count();
		} else {
			return Leitner.find({
				user_id: Meteor.userId(),
				box: boxId
			}).count();
		}
	},
	getChartTitle: function () {
		if (FlowRouter.getRouteName() === "progress") {
			let title = '»' + this.name + '«';
			if (Meteor.userId() === FlowRouter.getParam('user_id')) {
				return TAPi18n.__('admin.myProgress') + title;
			} else {
				return title + ' | ' + TAPi18n.__('admin.userProgress') + ' »' + getAuthorName(FlowRouter.getParam('user_id')) + '«';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	},
	getMaxWorkload: function () {
		let maxWorkload = Cardsets.findOne({_id: FlowRouter.getParam('_id')}).maxCards;
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
		if (Route.isLeitnerProgress()) {
			let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {shuffled: 1}});
			if (cardset !== undefined) {
				return cardset.shuffled;
			} else {
				return false;
			}
		}
	}
});

Template.graph.onRendered(function () {
	LeitnerProgress.drawGraph();
	LeitnerProgress.updateGraphLabels();
	new ResizeSensor($('#boxChart'), function () {
		LeitnerProgress.updateGraphLabels();
	});
});

/*
 * ############################################################################
 * progress
 * ############################################################################
 */

Template.progress.helpers({
	isStatsOwner: function () {
		return Meteor.userId() === FlowRouter.getParam('user_id');
	},
	gotProgressAccess: function () {
		return Meteor.userId() === FlowRouter.getParam('user_id') || UserPermissions.isOwner(Cardsets.findOne({_id: FlowRouter.getParam('_id')}).owner) || UserPermissions.isAdmin();
	}
});

Template.progress.events({
	"click #backButton": function () {
		if (Meteor.userId() === FlowRouter.getParam('user_id')) {
			FlowRouter.go('cardsetdetailsid', {
				_id: FlowRouter.getParam('_id')
			});
		} else {
			FlowRouter.go('cardsetstats', {
				_id: FlowRouter.getParam('_id')
			});
		}
	}
});

/*
 * ############################################################################
 * graphCardsetFilter
 * ############################################################################
 */

Template.graphCardsetFilter.helpers({
	getCardsetCardCount: function (countLeitnerCards = false) {
		return LeitnerProgress.getCardsetCardCount(countLeitnerCards);
	},
	shuffledData: function () {
		this.useLeitnerCount = true;
		return this;
	},
	isShuffledCardset: function () {
		if (Route.isLeitnerProgress()) {
			let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {shuffled: 1}});
			if (cardset !== undefined) {
				return cardset.shuffled;
			} else {
				return false;
			}
		}
	},
	getCardsetCount: function () {
		let count = 0;
		for (let i = 0; i < this.cardGroups.length; i++) {
			let cardset = Cardsets.findOne({_id: this.cardGroups[i]}, {fields: {_id: 1, cardType: 1}});
			if (CardType.gotLearningModes(cardset.cardType)) {
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
