//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';
import { Categories } from '../../api/categories.js';
import { Ratings } from '../../api/ratings.js';


import '../card/card.js';
import '../learn/box.js';
import '../learn/memo.js';

import './cardset.html';


Meteor.subscribe("cardsets");
Meteor.subscribe('ratings', function() {
  Session.set('ratingsLoaded', true);
});

Session.setDefault('cardSort', {
  front: 1
});

/**
 * ############################################################################
 * cardset
 * ############################################################################
 */

 Template.cardset.rendered = function(){
   Meteor.subscribe("cards", Router.current().params._id);
 }

Template.cardset.helpers({
  'onEditmodalClose': function(id) {
    Session.set('previousName', Cardsets.findOne(id).name);
    Session.set('previousDescription', Cardsets.findOne(id).description);
    Session.set('previousCategory', Cardsets.findOne(id).category);

    var previousCategory = Cardsets.findOne(id).category;
    var categoryId = previousCategory.toString();

    if (categoryId.length === 1) {
	     categoryId = "0" + categoryId;
    }

    var category = Categories.findOne(categoryId);
    if (category !== undefined) {
      Session.set('previousCategoryName', category.name);
    }
  },
  'hasCardsetPermission': function() {
    var userId = Meteor.userId();
    var cardsetKind = this.kind;

    var hasRole = false;
    if (Roles.userIsInRole(userId, 'pro')) {
      hasRole = true;
    }
    else if (Roles.userIsInRole(userId, 'university') && (cardsetKind  === 'edu' || cardsetKind === 'free')) {
      hasRole = true;
    }
    else if (cardsetKind === 'free') {
      hasRole = true;
    }

    return this.owner === Meteor.userId() || hasRole;
  }
});

Template.cardset.events({
  'click #cardSetSave': function(evt, tmpl) {
    if ($('#editSetName').val() === "") {
      $('#editSetNameLabel').css('color', '#b94a48');
      $('#editSetName').css('border-color', '#b94a48');
      $('#helpEditSetName').html(TAPi18n.__('modal-dialog.name_required'));
      $('#helpEditSetName').css('color', '#b94a48');
    }
    if ($('#editSetDescription').val() === "") {
      $('#editSetDescriptionLabel').css('color', '#b94a48');
      $('#editSetDescription').css('border-color', '#b94a48');
      $('#helpEditSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
      $('#helpEditSetDescription').css('color', '#b94a48');
    }
    if ($('#editSetName').val() !== "" && $('#editSetDescription').val() !== "") {
      var name = tmpl.find('#editSetName').value;
      if (tmpl.find('#editSetCategory').value === undefined) {
        tmpl.find('#editSetCategory').value = Cardsets.findOne(this._id).category;
      }
      var category = tmpl.find('#editSetCategory').value;
      var description = tmpl.find('#editSetDescription').value;

      Meteor.call("updateCardset", this._id, name, category, description);
      $('#editSetModal').modal('hide');
    }
  },
  'click #cardSetDelete': function() {
    $("#cardSetDelete").css('display', "none");
    $("#cardSetConfirm").css('display', "");

    $('#editSetModal').on('hidden.bs.modal', function() {
      $("#cardSetDelete").css('display', "");
      $("#cardSetConfirm").css('display', "none");
    });
  },
  'click #cardSetConfirm': function() {
    var id = this._id;

    $('#editSetModal').on('hidden.bs.modal', function() {
      Meteor.call("deleteCardset", id);
      Router.go('created');
    }).modal('hide');
  },
  'click .category': function(evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#editSetCategory').text(categoryName);
    tmpl.find('#editSetCategory').value = categoryId;
  }
});

/**
 * ############################################################################
 * cardsetForm
 * ############################################################################
 */

Template.cardsetForm.onRendered(function() {
  $('#editSetModal').on('hidden.bs.modal', function() {
    $('#helpEditSetName').html('');
    $('#helpEditSetDescription').html('');

    var previousName = Session.get('previousName');
    var previousDescription = Session.get('previousDescription');
    var previousCategoryName = Session.get('previousCategoryName');

    if (previousName !== $('#editSetName').val()) {
      $('#editSetName').val(previousName);
      $('#editSetNameLabel').css('color', '');
      $('#editSetName').css('border-color', '');
    }
    if (previousDescription !== $('#editSetDescription').val()) {
      $('#editSetDescription').val(previousDescription);
      $('#editSetDescriptionLabel').css('color', '');
      $('#editSetDescription').css('border-color', '');
    }
    if (previousCategoryName !== $('#editSetCategory').html()) {
      $('#editSetCategory').html(previousCategoryName);
    }
  });
});

Template.cardsetForm.helpers({
  'visible': function(visible) {
    return Cardsets.findOne(this._id).visible === visible;
  },
  'ratings': function(ratings) {
    return Cardsets.findOne(this._id).ratings === ratings;
  },
  'kind': function(kind) {
    return Cardsets.findOne(this._id).kind === kind;
  }
});

Template.cardsetForm.events({
  'keyup #editSetName': function() {
    $('#editSetNameLabel').css('color', '');
    $('#editSetName').css('border-color', '');
    $('#helpEditSetName').html('');
  },
  'keyup #editSetDescription': function() {
    $('#editSetDescriptionLabel').css('color', '');
    $('#editSetDescription').css('border-color', '');
    $('#helpEditSetDescription').html('');
  }
});

/**
 * ############################################################################
 * cardsetList
 * ############################################################################
 */

Template.cardsetList.helpers({
  cardlistMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".front" + index).html(html);
        $('table').addClass('table');
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back" + index).html(html);
        $('table').addClass('table');
      });
  },
  cardList: function() {
    return Cards.find({
      cardset_id: this._id
    }, {
      sort: Session.get("cardSort")
    });
  }
});

Template.cardsetList.events({
  'click .deleteCardList': function() {
    Session.set('cardId', this._id);
  },
  'click #set-details-region .frontdown': function() {
    Session.set('cardSort', {
      front: 1
    });
  },
  'click #set-details-region .frontup': function() {
    Session.set('cardSort', {
      front: -1
    });
  },
  'click #set-details-region .backdown': function() {
    Session.set('cardSort', {
      back: 1
    });
  },
  'click #set-details-region .backup': function() {
    Session.set('cardSort', {
      back: -1
    });
  }
});

Template.cardsetList.onDestroyed(function() {
  Session.set('cardSort', {
    front: 1
  });
});


/**
 * ############################################################################
 * cardsetDetails
 * ############################################################################
 */

Template.cardsetDetails.helpers({
  cardsIndex: function(index) {
    return index + 1;
  },
  cardActive: function(index) {
    return 0 === index;
  },
  cardCountOne: function(cardset_id) {
    var count = Cards.find({
      cardset_id: cardset_id
    }).count();
    return count !== 1;  },
  cardDetailsMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".detailfront" + index).html(html);
        $('table').addClass('table');
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".detailback" + index).html(html);
        $('table').addClass('table');
      });
  }
});

Template.cardsetDetails.events({
  "click .box": function() {
    if ($(".cardfront-symbol").css('display') === 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    } else if ($(".cardback-symbol").css('display') === 'none') {
      $(".cardfront-symbol").css('display', "none");
      $(".cardback-symbol").css('display', "");
      $(".cardfront").css('display', "none");
      $(".cardback").css('display', "");
    }
  },
  "click #leftCarouselControl, click #rightCarouselControl": function() {
    if ($(".cardfront-symbol").css('display') === 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    }
  },
  'click .item.active .block a': function() {
    evt.stopPropagation();
  }
});

/**
 * ############################################################################
 * cardsetInfo
 * ############################################################################
 */

Template.cardsetInfo.helpers({
  getAverage: function() {
    var ratings = Ratings.find({
      cardset_id: this._id
    });
    var count = ratings.count();
    if (count !== 0) {
      var amount = 0;
      ratings.forEach(function(rate) {
        amount = amount + rate.rating;
      });
      var result = (amount / count).toFixed(2);
      return result;
    } else {
      return 0;
    }
  },
  countRatings: function() {
    return Ratings.find({
      cardset_id: this._id
    }).count();
  },
  ratingEnabled: function() {
    return this.ratings === true;
  },
  hasRated: function() {
    var count = Ratings.find({
      cardset_id: this._id,
      user: Meteor.userId()
    }).count();
    var cardset = Cardsets.findOne(this._id);
    if (cardset !== null) {
      var owner = cardset.owner;
      return count !== 0 || owner === Meteor.userId();
    }
  },
  getKind: function() {
    switch (this.kind) {
      case "personal":
        return '<span class="label label-info">Private</span>';
      case "free":
        return '<span class="label label-default">Free</span>';
      case "edu":
        return '<span class="label label-success">Edu</span>';
      case "pro":
        return '<span class="label label-warning">Pro</span>';
      default:
        return '<span class="label label-danger">Undefined!</span>';
      }
  }
});

Template.cardsetInfo.events({
  "click #learnBox": function() {
    Router.go('box', {
      _id: this._id
    });
  },
  "click #learnMemo": function() {
    Router.go('memo', {
      _id: this._id
    });
  },
  'click #rating': function() {
    var cardset_id = Template.parentData(1)._id;
    var rating = $('#rating').data('userrating');
    var count = Ratings.find({
      cardset_id: this._id,
      user: Meteor.userId()
    }).count();
    if (count === 0) {
      Meteor.call("addRating", cardset_id, rating);
    }
  },
  'click #exportCardsBtn': function() {
    var cardset = Cardsets.findOne(this._id);
    var cards = Cards.find({
      cardset_id: this._id
    }, {
      fields: {
        'front': 1,
        'back': 1,
        '_id': 0
      }
    }).fetch();
    var cardsString = '';

    for (var card in cards) {
      cardsString += JSON.stringify(cards[card]);

      if (cards.length - 1 > card) {
        cardsString += ", ";
      }
    }

    var exportData = new Blob([cardsString], {
      type: "application/json"
    });
    saveAs(exportData, cardset.name + ".json");
  }
});

/**
 * ############################################################################
 * cardsetSidebar
 * ############################################################################
 */
Template.cardsetSidebar.events({
  "click #learnBox": function() {
    Router.go('box', {
      _id: this._id
    });
  },
  "click #learnMemo": function() {
    Router.go('memo', {
      _id: this._id
    });
  }
});

/**
 * ############################################################################
 * cardsetImportForm
 * ############################################################################
 */

Template.cardsetImportForm.onCreated(function() {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.cardsetImportForm.helpers({
  uploading: function() {
    return Template.instance().uploading.get();
  }
});

Template.cardsetImportForm.events({
  'change [name="uploadFile"]': function(evt, tmpl) {
    tmpl.uploading.set(true);
    var cardset_id = Template.parentData(1)._id;

    if (evt.target.files[0].name.match(/\.(json)$/)) {
      var reader = new FileReader();
      reader.onload = function() {
        var res = $.parseJSON('[' + this.result + ']');
        Meteor.call('parseUpload', res, cardset_id, function(error) {
          if (error) {
            tmpl.uploading.set(false);
            Bert.alert(TAPi18n.__('upload-form.wrong-template'), 'danger', 'growl-bottom-right');
          } else {
            tmpl.uploading.set(false);
            Bert.alert(TAPi18n.__('upload-form.success'), 'success', 'growl-bottom-right');
          }
        });
      };
      reader.readAsText(evt.target.files[0]);
    } else if (evt.target.files[0].name.match(/\.(csv)$/)) {
      Papa.parse(evt.target.files[0], {
        header: true,
        complete: function(results) {
          Meteor.call('parseUpload', results.data, cardset_id, function(error) {
          if (error) {
              tmpl.uploading.set(false);
              Bert.alert(TAPi18n.__('upload-form.wrong-template'), 'danger', 'growl-bottom-right');
            } else {
              tmpl.uploading.set(false);
              Bert.alert(TAPi18n.__('upload-form.success'), 'success', 'growl-bottom-right');
            }
          });
        }
      });
    } else {
      tmpl.uploading.set(false);
      Bert.alert(TAPi18n.__('upload-form.wrong-file'), 'danger', 'growl-bottom-right');
    }
  }
});

/**
 * ############################################################################
 * cardsetConfirmForm
 * ############################################################################
 */

Template.cardsetConfirmForm.events({
  'click #cardDelete': function() {
    var id = Session.get('cardId');

    $('#confirmModal').on('hidden.bs.modal', function() {
      Meteor.call("deleteCard", id);
    }).modal('hide');
  }
});

/**
 * ############################################################################
 * cardsetPublicateForm
 * ############################################################################
 */

 Template.cardsetPublicateForm.rendered = function(){
   console.log();
   var cardset = Cardsets.findOne(Router.current().params._id);

   if (cardset.kind === 'personal') {
    Session.set('kind', 'free');
   }
   else {
     Session.set('kind', cardset.kind);
   }

 }

Template.cardsetPublicateForm.helpers({
  kindIsFree: function(){
    return Session.get('kind') === 'free';
  },
  kindIsActive: function(kind) {
    return kind === Session.get('kind');
  }
});

Template.cardsetPublicateForm.events({
  'click #cardsetPublicate': function(evt, tmpl) {
    var id = this._id;
    var kind = tmpl.find('#publicateKind > .active > input').value;
    var price = 0;

    if (kind !== 'free') {
      price = tmpl.find('#publicatePrice').value;
    }

    $('#publicateModal').on('hidden.bs.modal', function() {
      Meteor.call("publicateCardset", id, kind, price, true);
    }).modal('hide');
  },
  'change #publicateKind': function(evt, tmpl){
    var kind = tmpl.find('#publicateKind > .active > input').value;
    Session.set('kind', kind);
  }
});
