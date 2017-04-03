//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
import {turnCard} from "../card/card.js";
import "./memo.html";


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

/*
 * ############################################################################
 * memo
 * ############################################################################
 */

Template.memo.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	if (!Session.get('activeCardset').learningActive) {
		var cards = Cards.find({
			cardset_id: Session.get('activeCardset')._id
		});
		cards.forEach(function (card) {
			Meteor.call("addLearned", Session.get('activeCardset')._id, card._id);
		});
	}
});

Template.memo.onDestroyed(function () {
	Session.set("showAnswer", false);
});

Template.memo.helpers({
	showAnswer: function () {
		turnCard();
		return Session.get('showAnswer');
	},
	isFinish: function () {
		var actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);

		var learned = Learned.findOne({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			nextDate: {
				$lte: actualDate
			}
		});

		return (learned === undefined);
	}
});

Template.memo.events({
	"click #memoShowAnswer": function () {
		Session.set('showAnswer', true);
	},
	"click .rate-answer": function (event) {
		var grade = $(event.currentTarget).data("id");

		var currentLearned = Learned.findOne({
			card_id: Session.get('currentCard'),
			user_id: Meteor.userId()
		});

		Meteor.call("updateLearnedMemo", currentLearned._id, grade);
		Session.set("showAnswer", false);
	}
});

/*
 * ############################################################################
 * memoRate
 * ############################################################################
 */

Template.memoRate.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		placement: 'bottom'
	});
	$('[data-toggle="popover"]').popover({
		placement: 'left'
	});
});
