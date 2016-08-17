//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cards } from '../../../api/cards.js';
import { Cardsets } from '../../../api/cardsets.js';

import './admin_cards.html';

import './admin_card.js';

/**
 * ############################################################################
 * admin_cards
 * ############################################################################
 */

Template.admin_cards.helpers({
  cardListAdmin: function() {
    return Cards.find();
  },
  tableSettings: function() {
    return {
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'front', label: TAPi18n.__('admin.front'), sortable: false,
          cellClass: function(value, object) {
            var css = 'front_' + object._id;
            return css;
          },
          fn: function(front, object) {
            Meteor.promise("convertMarkdown", front)
              .then(function(html) {
                $(".front_" + object._id).html(html);
              });
          }
        },
        { key: 'back', label: TAPi18n.__('admin.back'), sortable: false,
        cellClass: function(value, object) {
          var css = 'back_' + object._id;
          return css;
        },
        fn: function(front, object) {
          Meteor.promise("convertMarkdown", front)
            .then(function(html) {
              $(".back_" + object._id).html(html);
            });
        }
        },
        { key: 'cardset_id', label: TAPi18n.__('admin.cardset.header'), cellClass: 'cardsetname', fn: function(cardset_id) {
          var cardsetname = Cardsets.findOne({ _id: cardset_id });
          if (cardsetname) return cardsetname.name;
        }},
        { key: 'cardset_id', label: TAPi18n.__('admin.users'), cellClass: 'username', fn: function(cardset_id) {
          var cardsetname = Cardsets.findOne({ _id: cardset_id });
          if (cardsetname) return cardsetname.username;
        }},
        { key: '_id', label: TAPi18n.__('admin.edit'), sortable: false, cellClass: 'edit', fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminCard' class='editCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcard') + "' href='#' data-cardid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecard') + "' data-toggle='modal' data-target='#cardConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});

Template.admin_cards.events({
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var card = this;

    if (event.target.className == "deleteCardAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('cardId', card._id);
    }
  },
  'click #linkToAdminCard': function(event) {
    var cardid = $(event.currentTarget).data("cardid");
    Router.go('adminCard', { _id: cardid });
  }
});

/**
 * ############################################################################
 * cardConfirmFormAdmin
 * ############################################################################
 */

Template.cardConfirmFormAdmin.events({
  'click #cardDeleteAdmin': function() {
    var id = Session.get('cardId');

    $('#cardConfirmModalAdmin').on('hidden.bs.modal', function() {
      Meteor.call("deleteCard", id);
    }).modal('hide');
  }
});
