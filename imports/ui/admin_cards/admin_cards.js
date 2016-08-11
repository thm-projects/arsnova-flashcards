//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cards } from '../../api/cards.js';
import { Cardsets } from '../../api/cardsets.js';

import './admin_cards.html';



Template.admin_cards.helpers({
  cardListAdmin: function () {
    return Cards.find();
  },
  tableSettings: function () {
    return {
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'front', label: TAPi18n.__('admin.front') },
        { key: 'back', label: TAPi18n.__('admin.back') },
        { key: 'cardset_id', label: TAPi18n.__('admin.cardset'), fn: function(cardset_id) {
          var cardsetname = Cardsets.findOne({ _id: cardset_id });
          if (cardsetname) return cardsetname.name;
        }},
        { key: 'cardset_id', label: TAPi18n.__('admin.users'), fn: function(cardset_id) {
          var cardsetname = Cardsets.findOne({ _id: cardset_id });
          if (cardsetname) return cardsetname.username;
        }},
        { key: 'edit', label: TAPi18n.__('admin.edit'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcard') + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecard') + "'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});
