import "./progress.html";
import {Leitner} from "../../api/learned";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {getAuthorName} from "../../api/userdata";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor";
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
			let title = this.name + ": ";
			if (Meteor.userId() === Router.current().params.user_id) {
				return title + TAPi18n.__('admin.myProgress');
			} else {
				return title + TAPi18n.__('admin.userProgress') + ' "' + getAuthorName(Router.current().params.user_id) + '"';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	}
});

Template.graph.onRendered(function () {
	LeitnerProgress.drawGraph();
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
	gotCards: function () {
		return Leitner.find({
			cardset_id: Router.current().params._id,
			user_id: Router.current().params.user_id
		}).count();
	},
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
	getCardsets: function () {
		let cardsetList = "";
		let cardGroups = Cardsets.findOne({_id: Router.current().params._id}).cardGroups;
		let cardsets = Cardsets.find({_id: {$in: cardGroups}}, {
			fields: {_id: 1, name: 1, cardType: 1},
			sort: {name: 1}
		}).fetch();
		for (let i = 0; i < cardsets.length; i++) {
			if (CardType.gotLearningModes(cardsets[i].cardType)) {
				cardsetList += '<li class="cardset" value="' + cardsets[i]._id + ' + " data="' + cardsets[i]._id + '"><a href="#">' + cardsets[i].name + '</a></li>';
			}
		}
		return cardsetList;
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
		let cardset = $(evt.currentTarget).attr("data");
		$('#setCardsetFiter').html($(evt.currentTarget).text());
		$('#setCardsetFiter').val(cardset);
		LeitnerProgress.updateGraph(cardset);
	}
});
