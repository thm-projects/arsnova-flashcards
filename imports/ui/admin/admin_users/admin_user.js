//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { allUsers } from '../../../api/allusers.js';

import './admin_user.html';

/**
 * ############################################################################
 * admin_user
 * ############################################################################
 */

Template.admin_user.helpers({
  getService: function() {
    var userId = Router.current().params._id;
    if (userId !== undefined) {
      var user = Meteor.users.findOne(userId);
      if (user !== undefined) {
        if (user.services !== undefined){
          var service = _.keys(user.services)[0];
          service = service.charAt(0).toUpperCase() + service.slice(1);
          return service;
        }
      }
    }
    return null;
  },
  getDateUser: function() {
    return moment(this.createdAt).locale(getUserLanguage()).format('LL');
  },
  getLvl: function() {
    if (this.lvl === undefined) {
      return 0;
    }
    else {
      return this.lvl;
    }
  }
});
