//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../api/cardsets.js';
import {Ratings} from '../../api/ratings.js';

import './pool.html';

Meteor.subscribe("cardsets");

Session.setDefault('poolSortName', {lastName: 1});
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * events
 * ############################################################################
 */

Template.pool.events({
  'click #sortName': function() {
    var sort = Session.get('poolSortName');
    if (sort.name === 1) {
      Session.set('poolSortName', {name: -1});
    }
    else {
      Session.set('poolSortName', {name: 1});
    }
  },
  'click #sortLastName': function() {
    var lastNameFilter = Session.get('poolSortLastName');
    if(lastNameFilter.lastName === 1){
      Session.set('poolSortLastName', {lastName: 1});
    } else {
      Session.set('poolSortLastName', {lastName: -1});
    }
  }
});

/**
 * ############################################################################
 * helpers
 * ############################################################################
 */

Template.pool.helpers({
  cardsetList: function() {
    return Cardsets.find({
      owner: Meteor.userId()
    }, {
      sort: Session.get('poolSortName')
    });
  }
});