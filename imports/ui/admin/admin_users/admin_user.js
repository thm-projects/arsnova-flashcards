//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { allUsers } from '../../../api/allusers.js';
import { Cardsets } from '../../../api/cardsets.js';

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
  },
  getOnlineStatus: function() {
    if (this.status.online === true) {
      return "Online";
    }
    else {
      return "Offline";
    }
  },
  getLastLogin: function() {
    return moment(this.status.lastLogin.date).locale(getUserLanguage()).format('LLL');
  },
  cardsetListUserAdmin: function () {
    return Cardsets.find({ owner: this._id });
  },
  tableSettings: function() {
    return {
      showFilter: false,
      rowsPerPage: 5,
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'name', label: TAPi18n.__('admin.name') },
        { key: 'date', label: TAPi18n.__('admin.created'), fn: function(value) {
            return moment(value).locale(getUserLanguage()).format('LL');
        }},
        { key: '_id', label: TAPi18n.__('admin.edit'), sortable: false, cellClass: 'edit', fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminUserCardset' class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "' data-cardsetid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "' data-toggle='modal' data-target='#cardsetConfirmModalUserAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});

Template.admin_user.events({
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var cardset = this;

    if (event.target.className == "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('cardsetId', cardset._id);
    }
  },
  'click #linkToAdminUserCardset': function(event) {
    var cardsetid = $(event.currentTarget).data("cardsetid");
    Router.go('admin_cardset', { _id: cardsetid });
  },
});

/**
 * ############################################################################
 * cardsetConfirmFormUserAdmin
 * ############################################################################
 */

 Template.cardsetConfirmFormUserAdmin.events({
   'click #cardsetDeleteUserAdmin': function() {
     var id = Session.get('cardsetId');

     $('#cardsetConfirmModalUserAdmin').on('hidden.bs.modal', function() {
       Meteor.call("deleteCardset", id);
     }).modal('hide');
   }
 });
