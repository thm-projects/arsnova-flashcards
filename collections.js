//------------------------ ACCESS DATABASE

Cardsets = new Mongo.Collection('cardsets');
Categories = new TAPi18n.Collection("categories");

//------------------------ DATABASE METHODS
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
        date: date,
        visible: visible,
        ratings: ratings
      }
    });
  }
});
