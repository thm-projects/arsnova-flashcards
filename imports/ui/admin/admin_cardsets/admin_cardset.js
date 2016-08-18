//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Cardsets } from '../../../api/cardsets.js';
import { Cards } from '../../../api/cards.js';
import { Categories } from '../../../api/categories.js';

import './admin_cardset.html';

/**
 * ############################################################################
 * admin_cardset
 * ############################################################################
 */

Template.admin_cardset.helpers({
  'visible': function(visible) {
    if(Cardsets.findOne(this._id) !== undefined)
    {
      return Cardsets.findOne(this._id).visible === visible;
    }
  },
  'ratings': function(ratings) {
    if(Cardsets.findOne(this._id) !== undefined)
    {
      return Cardsets.findOne(this._id).ratings === ratings;
    }
  },
  'kind': function(kind) {
    if(Cardsets.findOne(this._id) !== undefined)
    {
      return Cardsets.findOne(this._id).kind === kind;
    }
  },
  cardListCardsetAdmin: function () {
    return Cards.find({ cardset_id: this._id });
  },
  tableSettings: function() {
    return {
      showFilter: false,
      rowsPerPage: 5,
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'front', label: TAPi18n.__('admin.front') },
        { key: 'back', label: TAPi18n.__('admin.back') },
        { key: 'options', label: TAPi18n.__('admin.edit'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='editCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcard') + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecard') + "'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  }
});

Template.admin_cardset.events({
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

      var visible = ('true' === tmpl.find('#editCardsetVisibilityAdmin > .active > input').value);
      var ratings = ('true' === tmpl.find('#editCardsetRatingAdmin > .active > input').value);
      var kind = tmpl.find('#editCardsetKindAdmin > .active > input').value;

      Meteor.call("updateCardset", this._id, name, category, description, visible, ratings, kind);
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
