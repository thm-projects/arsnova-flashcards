//------------------------ ACCESS DATABASE

Cardsets = new Mongo.Collection('cardsets');
Categories = new TAPi18n.Collection("categories");

//------------------------ DATABASE METHODS
Meteor.methods({
  addCardset: function (name, category, description, date) {
    // Make sure the user is logged in before inserting a cardset
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cardsets.insert({
      name: name,
      category: category,
      description: description,
      date: date,
      owner: Meteor.userId()
    });
  },
  deleteCardset: function (id) {
    Cardsets.remove(id);
  }
});
