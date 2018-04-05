//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "../cardset/cardset.js";
import "./results.html";
import {getCardTypeName} from "../../api/cardTypes";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("cardsets");


function getLeitnerCount(cardset) {
	return Leitner.find({
		cardset_id: cardset._id,
		user_id: Meteor.userId(),
		active: true
	}).count();
}

function getWozniakCount(cardset) {
	let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	actualDate.setHours(0, 0, 0, 0);
	return Wozniak.find({
		cardset_id: cardset._id, user_id: Meteor.userId(), nextDate: {
			$lte: actualDate
		}
	}).count();
}

/*
 * ############################################################################
 * cardsetCourseIterationResultRow
 * ############################################################################
 */

Template.cardsetCourseIterationResultRow.events({
	"click .addShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				if (!array.includes(cardset.cardGroups[i])) {
					array.push(cardset.cardGroups[i]);
				}
			}
			arrayExclude.push($(event.target).data('id'));
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array.push($(event.target).data('id'));
		}
		Session.set("ShuffledCardsets", array);
	},
	'click .deleteCourseIteration': function (event) {
		Session.set('courseIterationId', $(event.target).data('id'));
	},
	"click .removeShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			array = jQuery.grep(array, function (value) {
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					if (value === cardset.cardGroups[i]) {
						return false;
					}
				}
				return true;
			});
			arrayExclude = jQuery.grep(arrayExclude, function (value) {
				return value !== $(event.target).data('id');
			});
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array = jQuery.grep(array, function (value) {
				return value !== $(event.target).data('id');
			});
			for (let i = 0; i < Session.get("ShuffledCardsetsExclude").length; i++) {
				cardset = Cardsets.findOne({_id: Session.get("ShuffledCardsetsExclude")[i]}, {cardGroups: 1});
				let brokenHeart = true;
				for (let k = 0; k < cardset.cardGroups.length; k++) {
					if (array.includes(cardset.cardGroups[k])) {
						brokenHeart = false;
					}
				}
				if (brokenHeart) {
					arrayExclude.splice(i, 1);
				}
			}
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		}
		Session.set("ShuffledCardsets", array);
	},
	"click .learnLeitner": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnWozniak": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnSelect": function (event) {
		Session.set("activeCardset", $(event.target).data('id'));
	},
	'click .authorProfile': function (event) {
		event.preventDefault();
		Router.go('profileOverview', {
			_id: $(event.target).data('id')
		});
	},
	'click .resultName': function (event) {
		event.preventDefault();
		Router.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	}
});

Template.cardsetCourseIterationResultRow.helpers({
	inShuffleSelection: function (cardset_id) {
		if (Session.get("ShuffledCardsets").includes(cardset_id) || Session.get("ShuffledCardsetsExclude").includes(cardset_id)) {
			return true;
		}
	},
	getLink: function (cardset_id) {
		return ActiveRoute.name('shuffle') ? "#" : ("/cardset/" + cardset_id);
	},
	getLearnphaseStatus: function () {
		if (this.learningActive) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	},
	getWorkloadType: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		if (leitner !== 0 && wozniak === 0) {
			return "learnLeitner";
		} else if (leitner === 0 && wozniak !== 0) {
			return "learnWozniak";
		} else if (leitner !== 0 && wozniak !== 0) {
			return "learnSelect";
		} else {
			return "";
		}
	},
	gotWorkloadForBothTypes: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		return leitner !== 0 && wozniak !== 0;
	},
	getWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.noCardsToLearn');
			case 1:
				return TAPi18n.__('set-list.cardsToLearn');
			default:
				return count + TAPi18n.__('set-list.cardsToLearnPlural');
		}
	},
	gotDescription: function (text) {
		if (text !== "" && text !== undefined) {
			return true;
		}
	},
	getCardTypeName: function () {
		return getCardTypeName(this.cardType);
	},
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "Personal";
			case "free":
				return "Free";
			case "edu":
				return "Edu";
			case "pro":
				return "Pro";
		}
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	},
	firstItem: function (index) {
		return index === 0;
	}
});
