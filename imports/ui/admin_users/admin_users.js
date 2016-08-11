//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './admin_users.html';

import { allUsers } from '../../api/allusers.js';

Meteor.subscribe('allUsers');



Template.admin_users.helpers({
  userListAdmin: function () {
    return Meteor.users.find();
  },
  tableSettings: function () {
    return {
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'roles', label: TAPi18n.__('admin.roles') },
        { key: 'profile.name', label: TAPi18n.__('admin.users') },
        { key: 'mailto', label: TAPi18n.__('admin.mail'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "'><i class='glyphicon glyphicon-envelope'></i></a>");
        }},
        { key: 'createdAt', label: TAPi18n.__('admin.joined') },
        { key: 'edit', label: TAPi18n.__('admin.edit'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }}
      ]
    }
  }
});
