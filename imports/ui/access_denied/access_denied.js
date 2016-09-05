//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Notifications } from '../../api/notifications.js';
import { userData } from '../../api/userdata.js';

import './access_denied.html';

Meteor.subscribe("notifications");

/**
 * ############################################################################
 * access_denied_nav_admin
 * ############################################################################
 */

Template.access_denied.events({
  'click #logout_access_denied': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  },
  'click #logout_access_denied_blocked': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});

/**
 * ############################################################################
 * access_denied_nav_admin
 * ############################################################################
 */

 Template.access_denied_nav_admin.onRendered(function() {
   Session.set("searchValue", undefined);
 });

Template.access_denied_nav_admin.helpers({
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
  },
  countNotifications: function() {
    return Notifications.find({read: false, target_type: 'user', target: Meteor.userId() }).count();
  },
  getNotifications: function() {
    return Notifications.find({ cleared: false, target_type: 'user', target: Meteor.userId() }, {sort: {date: -1}});
  },
  getLink: function() {
    return "/cardset/" + this.link_id;
  }
});

Template.access_denied_nav_admin.events({
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
  },
  'click #notificationsBtn': function() {
    var notifications = Notifications.find({read: false, target_type: 'user', target: Meteor.userId()});
    notifications.forEach(function (notification) {
      Meteor.call("setNotificationAsRead", notification._id);
    });
  },
  'click #clearBtn': function() {
    var notifications = Notifications.find({cleared: false, target_type: 'user', target: Meteor.userId()});
    notifications.forEach(function (notification) {
      Meteor.call("setNotificationAsCleared", notification._id);
    });
  }
});
