Meteor.methods({
  addCardset: function(name, category, description, visible, ratings) {
    // Make sure the user is logged in before inserting a cardset
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.insert({
      name: name,
      category: category,
      description: description,
      date: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().profile.name,
      visible: visible,
      ratings: ratings
    });
  },
  deleteCardset: function(id) {
    // Make sure only the task owner can make a task private
    var cardset = Cardsets.findOne(id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.remove(id);
    Cards.remove({
      cardset_id: id
    });
  },
  updateCardset: function(id, name, category, description, visible, ratings) {
    // Make sure only the task owner can make a task private
    var cardset = Cardsets.findOne(id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.update(id, {
      $set: {
        name: name,
        category: category,
        description: description,
        visible: visible,
        ratings: ratings
      }
    });
  },
  addCard: function(cardset_id, front, back) {
    // Make sure the user is logged in and is authorized
    var cardset = Cardsets.findOne(cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.insert({
      front: front,
      back: back,
      cardset_id: cardset_id
    });
  },
  deleteCard: function(card_id) {
    // Make sure the user is logged in and is authorized
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.remove(card_id);
    Learned.remove({
      card_id: card_id
    });
  },
  updateCard: function(card_id, front, back) {
    // Make sure the user is logged in and is authorized
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.update(card_id, {
      $set: {
        front: front,
        back: back
      }
    });
  },
  addLearned: function(cardset_id, card_id) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Learned.upsert({
      cardset_id: cardset_id,
      card_id: card_id,
      user_id: Meteor.userId()
    }, {
      $set: {
        cardset_id: cardset_id,
        card_id: card_id,
        user_id: Meteor.userId()
      },
      $setOnInsert: {
        box: 1,
        ef: 2.5,
        reps: 0,
        interval: 0,
        nextDate: new Date()
      }
    });
  },
  updateLearned: function(learned_id, box) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Learned.update(learned_id, {
      $set: {
        box: box
      }
    });
  },
  updateLearnedMemo: function(learned_id, grade) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    // EF (easiness factor) is a rating for how difficult the card is.
    // Grade: (0-2) Set reps and interval to 0, keep current EF (repeat card today)
    //        (3)   Set interval to 0, lower the EF, reps + 1 (repeat card today)
    //        (4-5) Reps + 1, interval is calculated using EF, increasing in time.

    var learned = Learned.findOne(learned_id),
      ef = learned.ef,
      reps = learned.reps,
      nextDate = new Date();

    if (grade < 3) {
      reps = 0;
      interval = 0;
    } else {
      ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
      if (ef < 1.3) ef = 1.3;
      reps = reps + 1;
      if (grade === 3) {
        interval = 0;
      } else {
        switch (reps) {
          case 1:
            interval = 1;
            break;
          case 2:
            interval = 6;
            break;
          default:
            interval = Math.ceil((reps - 1) * ef);
            break;
        }
        nextDate.setDate(nextDate.getDate() + interval);
      }
    }

    Learned.update(learned_id, {
      $set: {
        ef: ef,
        reps: reps,
        interval: interval,
        nextDate: nextDate
      }
    });
  }
});
