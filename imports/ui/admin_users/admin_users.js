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
        { key: 'roles', label: 'Roles'},
        { key: 'profile.name', label: 'User' },
        { key: 'mailto', label: 'Mail', sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default title='Mail to User'><i class='glyphicon glyphicon-envelope'></i></a>")
        }},
        { key: 'createdAt', label: 'Joined' },
        { key: 'edit', label: 'Edit', sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editUserAdmin btn btn-xs btn-default title='Edit User'><i class='glyphicon glyphicon-pencil'></i></a>")
        }}
      ]
    }
  }
});
