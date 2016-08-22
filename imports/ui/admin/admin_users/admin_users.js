//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { allUsers } from '../../../api/allusers.js';

import './admin_users.html';

import './admin_user.js';


Meteor.subscribe('allUsers');

/**
 * ############################################################################
 * admin_users
 * ############################################################################
 */

Template.admin_users.helpers({
  userListAdmin: function () {
    return Meteor.users.find();
  },
  tableSettings: function () {
    return {
      showNavigationRowsPerPage: false,
      fields: [
        { key: '_id', label: TAPi18n.__('admin.admin'), cellClass:'admin', fn: function(value) {
          if (Roles.userIsInRole(value, 'admin') || Roles.userIsInRole(value, 'editor')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: 'profile.name', label: TAPi18n.__('admin.users') },
        { key: '_id', label: TAPi18n.__('admin.pro'), cellClass:'pro', fn: function(value) {
          if (Roles.userIsInRole(value, 'pro')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.university'), cellClass:'university', fn: function(value) {
          if (Roles.userIsInRole(value, 'university')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.lecturer'), cellClass:'lecturer', fn: function(value) {
          if (Roles.userIsInRole(value, 'lecturer')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: 'mailto', label: TAPi18n.__('admin.mail'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "'><i class='fa fa-envelope'></i></a>");
        }},
        { key: 'createdAt', label: TAPi18n.__('admin.joined'), fn: function(value) {
          return moment(value).locale(getUserLanguage()).format('LL');
        }},
        { key: '_id', label: TAPi18n.__('admin.blocked'), cellClass:'blocked', fn: function(value) {
          if (Roles.userIsInRole(value, 'blocked')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.edit'), cellClass:'edit', sortable: false, fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminUser' class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "' data-userid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: '_id', label: TAPi18n.__('admin.delete'), cellClass:'delete', sortable: false, fn: function(value) {
          if (Meteor.user()._id !== value) {
            if(!Roles.userIsInRole(value, 'admin')) {
              return new Spacebars.SafeString("<a class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
            }
          }
        }}
      ]
    }
  }
});

Template.admin_users.events({
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var user = this;

    if (event.target.className == "deleteUserAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('userId', user._id);
    }
  },
  'click #linkToAdminUser': function(event) {
    var userid = $(event.currentTarget).data("userid");
    Router.go('admin_user', { _id: userid });
  }
});

/**
 * ############################################################################
 * userConfirmFormAdmin
 * ############################################################################
 */

 Template.userConfirmFormAdmin.events({
   'click #userDeleteAdmin': function() {
     var id = Session.get('userId');

     $('#userConfirmModalAdmin').on('hidden.bs.modal', function() {
       Meteor.call("deleteUser", id);
     }).modal('hide');
   }
 });
