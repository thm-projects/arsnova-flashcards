Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

/**
 * ############################################################################
 * memo
 * ############################################################################
 */

Template.name.rendered = function() {
  Session.set('showAnswer', false);
};

Template.memo.destroyed = function() {
  Session.set("showAnswer", false);
};

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
  addLearned: function() {
    cards = Cards.find({
      cardset_id: this._id
    });
    cards.forEach(function(card) {
      Meteor.call("addLearned", card.cardset_id, card._id);
    });
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
    console.log(learned);
    if (learned !== undefined) {
      var cards = Cards.findOne({
        cardset_id: this._id,
        _id: learned.card_id
      });
      Session.set('currentCard', cards._id);
      return cards;
    }

  },
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

Template.memoRate.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'bottom'
  });
  $('[data-toggle="popover"]').popover({
    placement: 'left'
  });
};
