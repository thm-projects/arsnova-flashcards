import "./progress.html";
import {Leitner} from "../../api/learned";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {getAuthorName} from "../../api/userdata";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {LeitnerProgress} from "../../api/leitnerProgress";
import {Cardsets} from "../../api/cardsets";
import {CardType} from "../../api/cardTypes";
import {Route} from "../../api/route";

/*
 * ############################################################################
 * Graph
 * ############################################################################
 */

Template.graph.helpers({
	countBox: function (boxId) {
		if (Router.current().route.getName() === "progress") {
			return Leitner.find({
				cardset_id: Router.current().params._id,
				user_id: Router.current().params.user_id,
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
		if (Router.current().route.getName() === "progress") {
			let title = '»' + this.name + '«';
			if (Meteor.userId() === Router.current().params.user_id) {
				return TAPi18n.__('admin.myProgress') + title;
			} else {
				return title + ' | ' + TAPi18n.__('admin.userProgress') + ' »' + getAuthorName(Router.current().params.user_id) + '«';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	},
	getMaxWorkload: function () {
		let maxWorkload = Cardsets.findOne({_id: Router.current().params._id}).maxCards;
		if (maxWorkload === 1) {
			return TAPi18n.__('bonus.progress.maxWorkload.single', {amount: maxWorkload}, Session.get('activeLanguage'));
		} else {
			return TAPi18n.__('bonus.progress.maxWorkload.plural', {amount: maxWorkload}, Session.get('activeLanguage'));
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
		return Meteor.userId() === Router.current().params.user_id;
	}
});

Template.progress.events({
	"click #backButton": function () {
		if (Meteor.userId() === Router.current().params.user_id) {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			Router.go('cardsetstats', {
				_id: Router.current().params._id
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
	getCardsets: function (countLeitnerCards = false) {
		let cardsetList = [];
		let cardsetLeitnerCount = 0;
		let cardGroups = Cardsets.findOne({_id: Router.current().params._id}).cardGroups;
		let cardsets = Cardsets.find({_id: {$in: cardGroups}}, {
			fields: {_id: 1, name: 1, cardType: 1, difficulty: 1, quantity: 1},
			sort: {name: 1}
		}).fetch();
		for (let i = 0; i < cardsets.length; i++) {
			if (CardType.gotLearningModes(cardsets[i].cardType)) {
				if (countLeitnerCards) {
					cardsetLeitnerCount += cardsets[i].quantity;
				} else {
					cardsetList.push(cardsets[i]);
				}
			}
		}
		if (countLeitnerCards) {
			return cardsetLeitnerCount;
		} else {
			return cardsetList;
		}
	},
	isShuffledCardset: function () {
		if (Route.isLeitnerProgress()) {
			let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {shuffled: 1}});
			if (cardset !== undefined) {
				return cardset.shuffled;
			} else {
				return false;
			}
		}
	}
});
Template.graphCardsetFilter.events({
	'click .cardset': function (evt) {
		let cardset_id = $(evt.currentTarget).attr("data-id");
		let cardset_name = $(evt.currentTarget).attr("data-name");
		$('#setCardsetFiter').html(cardset_name);
		$('#setCardsetFiter').val(cardset_id);
		LeitnerProgress.updateGraph(cardset_id);
	}
});
