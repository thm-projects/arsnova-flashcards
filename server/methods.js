Meteor.methods({
  addCardset: function(name, category, description, date, visible, ratings) {
    // Make sure the user is logged in before inserting a cardset
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.insert({
      name: name,
      category: category,
      description: description,
      date: date,
      owner: Meteor.userId(),
      username: Meteor.user().profile.name,
      visible: visible,
      ratings: ratings
    });
  },
  deleteCardset: function(id) {
    Cardsets.remove(id);
    Cards.remove({
      cardset_id: id
    });
  },
  updateCardset: function(id, name, category, description, visible, ratings) {
    // Make sure only the task owner can make a task private
    var deck = Cardsets.findOne(id);
    if (deck.owner !== Meteor.userId()) {
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
    var deck = Cardsets.findOne(cardset_id);
    if (!Meteor.userId() && deck.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.insert({
      front: front,
      back: back,
      cardset_id: cardset_id
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
        box: 1
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
  }
});
