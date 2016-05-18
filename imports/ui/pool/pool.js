//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Categories } from '../../api/categories.js';

import './pool.html';


Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Session.setDefault('poolSort', {name: 1});

/**
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
  getDecks: function() {
    var id = parseInt(this._id);
    return Cardsets.find({
      category: id,
      visible: true
    }, {
      sort: Session.get('poolSort')
    });
  }
});

Template.category.events({
  'click #pool-category-region .namedown': function() {
    Session.set('poolSort', {name: 1});
  },
  'click #pool-category-region .nameup': function() {
    Session.set('poolSort', {name: -1});
  },
  'click #pool-category-region .createddown': function() {
    Session.set('poolSort', {username: 1});
  },
  'click #pool-category-region .createdup': function() {
    Session.set('poolSort', {username: -1});
  }
});

Template.category.onDestroyed(function() {
  Session.set('poolSort', {name: 1});
});

/**
 * ############################################################################
 * helpers
 * ############################################################################
 */

Template.pool.helpers({
  getCount: function(id) {
    return Cardsets.find({
      category: parseInt(id),
      visible: true
    }).count();
  }
});
