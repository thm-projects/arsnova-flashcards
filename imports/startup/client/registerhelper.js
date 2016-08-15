import { Meteor } from 'meteor/meteor';
import { Categories } from '../../api/categories.js';
import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';

// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function() {
  var userId = Meteor.userId();
  var cardsetKind = this.kind;

  var hasRole = false;
  if (Roles.userIsInRole(userId, 'pro')) {
    hasRole = true;
  }
  else if (Roles.userIsInRole(userId, 'university') && (cardsetKind  === 'edu' || cardsetKind === 'free')) {
    hasRole = true;
  }
  else if (cardsetKind === 'free') {
    hasRole = true;
  }

  return this.owner === Meteor.userId() || (this.visible === true && hasRole);
});

// Check if user is owner of a cardset
Template.registerHelper("isOwnerCard", function() {
    var owner;
    if(this._id) {
	     owner = Cardsets.findOne(Router.current().params._id).owner;
    }
    return owner === Meteor.userId();
});

Template.registerHelper("isOwner", function() {
  var owner;
  if (this.owner) {
    owner = this.owner;
  }
  if (owner === undefined) {
    owner = Template.parentData(1).owner;
  }
  return owner === Meteor.userId();
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
  if (id.length === 1) {
    id = "0" + id;
  }

  var category = Categories.findOne(id);
  if (category !== undefined) {
    return category.name;
  }
});
