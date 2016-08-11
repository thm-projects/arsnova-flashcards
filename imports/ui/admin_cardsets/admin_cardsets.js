//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';

import './admin_cardsets.html';


Template.admin_cardsets.helpers({
  cardsetListAdmin: function () {
    return Cardsets.find();
  },
  tableSettings: function () {
    return {
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'name', label: TAPi18n.__('admin.name') },
        { key: 'username', label: TAPi18n.__('admin.users') },
        { key: 'date', label: TAPi18n.__('admin.created') },
        { key: 'edit', label: TAPi18n.__('admin.edit'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});
