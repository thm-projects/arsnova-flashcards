//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './main.html';

import '../welcome/welcome.js';
import '../impressum/impressum.js';
import '../cardsets/cardsets.js';
import '../pool/pool.js';
import '../profile/profile.js'
import '../admin_main/admin_main.js';

Meteor.subscribe("Users");

Template.main.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  },
  'keyup #input-search': function(event) {
    event.preventDefault();
    Session.set("searchValue", $(event.currentTarget).val());
    if ($(event.currentTarget).val() && CardsetsIndex.search(Session.get("searchValue")).count()) {
      $('#searchDropdown').addClass("open");
    } else {
      $('#searchDropdown').removeClass("open");
    }
  },
  'click #searchResults': function() {
    $('#searchDropdown').removeClass("open");
    $('#input-search').val('');
  }
});

Template.main.helpers({
  getYear: function() {
    return moment(new Date()).format("YYYY");
  },
  getUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    }
  },
  searchCategories: function() {
    if (Session.get("searchValue")) {
      results = CardsetsIndex.search(Session.get("searchValue")).fetch();
      return results;
    } else {
      return undefined;
    }
  },
  isActiveProfile: function() {
    if (ActiveRoute.name(/^profile/)) {
      return Router.current().params._id === Meteor.userId();
    }
    return false;
  }
});

Template.main.onRendered(function() {
  Session.set("searchValue", undefined);

  var user = Meteor.users.findOne({
    _id: Meteor.userId(),
    lvl: {
      $exists: false
    }
  });

  if (user !== undefined){
    Meteor.call("initUser");
  }
});
