//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../../api/cardsets.js';
import { Cards } from '../../../api/cards.js';
import { Categories } from '../../../api/categories.js';

import './admin_cardset.html';

/**
 * ############################################################################
 * admin_cardset
 * ############################################################################
 */

 Template.admin_cardset.onRendered(function() {
    Session.set('kind', this.kind);
 });

Template.admin_cardset.helpers({
  kindIsActive: function(kind) {
    return kind === this.kind;
  },
  kindWithPrice: function(){
    if (Session.get('kind') === 'edu' || Session.get('kind') === 'pro') {
      return true;
    } else if (this.kind === 'edu' || this.kind === 'pro') {
      return true;
    } else {
      return false;
    }
    return (this.kind === 'edu' || this.kind === 'pro');
  },
  userExistsCardset: function(username, owner) {
    if (username === 'Deleted' || username === 'Blocked') {
      return false;
    }
    else {
      return true;
    }
  },
  cardListCardsetAdmin: function () {
    return Cards.find({ cardset_id: this._id });
  },
  tableSettings: function() {
    return {
      rowsPerPage: 5,
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
        { key: '_id', label: TAPi18n.__('admin.edit'), sortable: false, cellClass: 'edit', fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminCardsetCard' class='editCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcard') + "' data-cardid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecard') + "' data-toggle='modal' data-target='#cardConfirmModalCardsetAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});

Template.admin_cardset.events({
  'change #publicateKindAdmin': function(evt, tmpl){
    var kind = tmpl.find('#publicateKindAdmin > .active > input').value;
    Session.set('kind', kind);
  },
  'click #cardsetSaveAdmin ': function(evt, tmpl) {
    if ($('#editCardsetNameAdmin').val() === "") {
      $('#editCardsetNameLabelAdmin').css('color', '#b94a48');
      $('#editCardsetNameAdmin').css('border-color', '#b94a48');
      $('#helpEditCardsetNameAdmin').html(TAPi18n.__('admin.cardset.name_required'));
      $('#helpEditCardsetNameAdmin').css('color', '#b94a48');
    }
    if ($('#editCardsetDescriptionAdmin').val() === "") {
      $('#editCardsetDescriptionLabelAdmin').css('color', '#b94a48');
      $('#editCardsetDescriptionAdmin').css('border-color', '#b94a48');
      $('#helpEditCardsetDescriptionAdmin').html(TAPi18n.__('admin.cardset.description_required'));
      $('#helpEditCardsetDescriptionAdmin').css('color', '#b94a48');
    }
    if ($('#editCardsetNameAdmin').val() !== "" && $('#editCardsetDescriptionAdmin').val() !== "") {
      var name = tmpl.find('#editCardsetNameAdmin').value;
      var description = tmpl.find('#editCardsetDescriptionAdmin').value;

      if (tmpl.find('#editCardsetCategoryAdmin').value === undefined) {
        tmpl.find('#editCardsetCategoryAdmin').value = Cardsets.findOne(this._id).category;
      }
      var category = tmpl.find('#editCardsetCategoryAdmin').value;

      var kind = tmpl.find('#publicateKindAdmin > .active > input').value;
      var price = 0;
      var visible = true;

      if (kind === 'edu' || kind === 'pro') {
        if (tmpl.find('#publicatePriceAdmin') !== null) {
          price = tmpl.find('#publicatePriceAdmin').value;
        }
        else {
          price = this.price;
        }
      }
      if (kind === 'personal') {
        visible = false;
      }
      if (kind === 'pro') {
        visible = false;
        Meteor.call("publicateProRequest", this._id, false, true, visible);

        var text = "Neuer Pro-Kartensatz zur Überprüfung freigegeben";
        var type = "Pro-Überprüfung";
        var target = "lecturer";

        Meteor.call("addNotification", target, type, text);
      }

      Meteor.call("publicateCardset", this._id, kind, price, visible);
      Meteor.call("updateCardset", this._id, name, category, description);
      window.history.go(-1);
    }
  },
  'click #cardsetCancelAdmin': function() {
    window.history.go(-1);
  },
  'click #cardsetDeleteAdmin': function() {
    $("#cardsetDeleteAdmin").css('display', "none");
    $("#cardsetConfirmAdmin").css('display', "");
  },
  'click #cardsetConfirmAdmin': function() {
    var id = this._id;
    Meteor.call("deleteCardset", id);
    window.history.go(-1);
  },
  'click .category': function(evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#editCardsetCategoryAdmin').text(categoryName);
    tmpl.find('#editCardsetCategoryAdmin').value = categoryId;
  },
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var card = this;

    if (event.target.className == "deleteCardAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('cardId', card._id);
    }
  },
  'click #linkToAdminCardsetCard': function(event) {
    var cardid = $(event.currentTarget).data("cardid");
    Router.go('adminCard', { _id: cardid });
  },
  'keyup #editCardsetNameAdmin': function() {
    $('#editCardsetNameLabelAdmin').css('color', '');
    $('#editCardsetNameAdmin').css('border-color', '');
    $('#helpEditCardsetNameAdmin').html('');
  },
  'keyup #editCardsetDescriptionAdmin': function() {
    $('#editCardsetDescriptionLabelAdmin').css('color', '');
    $('#editCardsetDescriptionAdmin').css('border-color', '');
    $('#helpEditCardsetDescriptionAdmin').html('');
  }
});

/**
 * ############################################################################
 * cardConfirmFormCardsetAdmin
 * ############################################################################
 */

Template.cardConfirmFormCardsetAdmin.events({
  'click #cardDeleteCardsetAdmin': function() {
    var id = Session.get('cardId');

    $('#cardConfirmModalCardsetAdmin').on('hidden.bs.modal', function() {
      Meteor.call("deleteCard", id);
    }).modal('hide');
  }
});
