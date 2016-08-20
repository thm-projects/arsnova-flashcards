//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './admin_users.html';

import { allUsers } from '../../../api/allusers.js';

Meteor.subscribe('allUsers');



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
        { key: 'profile.name', label: TAPi18n.__('admin.users') },
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
        { key: 'edit', label: TAPi18n.__('admin.edit'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});
