//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Categories } from '../../api/categories.js';

import './admin_main.html';

import '../admin_dashboard/admin_dashboard.js';
import '../admin_cardsets/admin_cardsets.js';
import '../admin_cards/admin_cards.js';
import '../admin_users/admin_users.js';


Template.admin_main.events({
  'click #logout_admin': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});
