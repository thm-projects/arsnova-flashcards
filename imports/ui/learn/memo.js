//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';
import { Learned } from '../../api/learned.js';

import './memo.html';


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

/**
 * ############################################################################
 * memo
 * ############################################################################
 */

Template.memo.onCreated(function() {
  var cardset_id = Router.current().params._id;
  cards = Cards.find({
    cardset_id: cardset_id
  });
  cards.forEach(function(card) {
    Meteor.call("addLearned", card.cardset_id, card._id);
  });
});

Template.memo.onDestroyed(function() {
  Session.set("showAnswer", false);
});

Template.memo.helpers({
  showAnswer: function() {
    return Session.get('showAnswer');
  },
  isFinish: function() {
    var actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    actualDate.setHours(0, 0, 0, 0);

    var learned = Learned.findOne({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      nextDate: {
        $lte: actualDate
      }
    });

    return (learned === undefined);
  },
  getMemoCard: function() {
    var actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    actualDate.setHours(0, 0, 0, 0);

    var learned = Learned.findOne({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      nextDate: {
        $lte: actualDate
      }
    }, {
      sort: {
        nextDate: 1
      }
    });
    if (learned !== undefined) {
      var cards = Cards.findOne({
        cardset_id: this._id,
        _id: learned.card_id
      });
      Session.set('currentCard', cards._id);
      return cards;
    }
  },
  memoMarkdownFront: function(front) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".box .frontblock span").html(html);
        $('table').addClass('table');
    });
  },
  memoMarkdownBack: function(back) {
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".box .backblock span").html(html);
        $('table').addClass('table');
    });
  }
});

Template.memo.events({
  "click #memoShowAnswer": function() {
    Session.set('showAnswer', true);
  },
  "click .rate-answer": function(event) {
    var grade = $(event.currentTarget).data("id");

    var currentLearned = Learned.findOne({
      card_id: Session.get('currentCard'),
      user_id: Meteor.userId()
    });

    Meteor.call("updateLearnedMemo", currentLearned._id, grade);
    Session.set("showAnswer", false);
  }
});

/**
 * ############################################################################
 * memoRate
 * ############################################################################
 */

Template.memoRate.onRendered(function() {
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'bottom'
  });
  $('[data-toggle="popover"]').popover({
    placement: 'left'
  });
});
