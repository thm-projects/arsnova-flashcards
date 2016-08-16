import { Meteor } from 'meteor/meteor';
import { Categories } from '../../api/categories.js';
import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';

// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function() {
  return this.owner === Meteor.userId() || this.visible === true;
});

// Check if user is in role to look at a cardset
Template.registerHelper("isInRole", function() {
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

  return this.owner === Meteor.userId() || hasRole;
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
  var owner = undefined;
  if (this.owner) {
    owner = this.owner;
  }
  else if (Template.parentData(1)) {
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
  if(value !== null)
  {
    var id = value.toString();
    if (id.length === 1) {
      id = "0" + id;
    }

    var category = Categories.findOne(id);
    if (category !== undefined) {
      return category.name;
    }
  }
});
