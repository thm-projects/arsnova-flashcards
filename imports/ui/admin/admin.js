//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Notifications } from '../../api/notifications.js';

import './admin.html';

import './admin_dashboard/admin_dashboard.js';
import './admin_cardsets/admin_cardsets.js';
import './admin_cards/admin_cards.js';
import './admin_users/admin_users.js';
import './admin_notifications/admin_notifications.js';


Meteor.subscribe("notifications");

/**
 * ############################################################################
 * admin_main
 * ############################################################################
 */

Template.admin_main.events({
  'click #logout_admin': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});

Template.admin_main.helpers({
  getUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    }
  },
  getNotifications: function() {
    return Notifications.find({ target_type: 'admin' }, {sort: {date: -1}});
  }
});
