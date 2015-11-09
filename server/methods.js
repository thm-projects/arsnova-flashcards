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
      ratings: ratings,
      cards: []
    });
  },
  deleteCardset: function(id) {
    Cardsets.remove(id);
  },
  updateCardset: function(id, name, category, description, date, visible, ratings) {
    var deck = Cardsets.findOne(id);

    // Make sure only the task owner can make a task private
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
  addCard: function(cardset, front, back) {
    // Make sure the user is logged in and is authorized
    if (!Meteor.userId() && deck.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.update(cardset, {
      $push: {
        cards: {
          front: front,
          back: back
        }
      }
    });
  }
});
