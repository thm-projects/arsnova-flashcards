// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function() {
  return this.owner === Meteor.userId() || this.visible === true;
});

// Check if user is owner of a cardset
Template.registerHelper("isOwner", function() {
  return this.owner === Meteor.userId();
});

// Returns the number of cards in a carddeck
Template.registerHelper("countCards", function(cardset_id) {
  return Cards.find({
    cardset_id: cardset_id
  }).count();
});

// Returns all Cards of a Carddeck
Template.registerHelper("getCards", function() {
  return Cards.find({
    cardset_id: this._id
  });
});

// Returns the locale date
Template.registerHelper("getDate", function() {
  return moment(this.date).locale(getUserLanguage()).format('LL');
});

// Returns all Categories
Template.registerHelper("getCategories", function() {
  return Categories.find({}, {
    sort: {
      name: 1
    }
  });
});

// Return the name of a Category
Template.registerHelper("getCategory", function(value) {
  var id = value.toString();
  if (id.length == 1) id = "0" + id;

  var category = Categories.findOne(id);
  if (category !== undefined) {
    return category.name;
  }
});
