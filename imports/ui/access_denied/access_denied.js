//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Notifications } from '../../api/notifications.js';

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
  }
});

/**
 * ############################################################################
 * access_denied_nav_admin
 * ############################################################################
 */

Template.access_denied_nav_admin.helpers({
  getUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    }
  },
  getNotifications: function() {
    return Notifications.find({}, {sort: {date: -1}});
  }
});
