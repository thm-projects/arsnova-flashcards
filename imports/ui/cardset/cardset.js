//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';
import { Categories } from '../../api/categories.js';
import { Ratings } from '../../api/ratings.js';
import { Paid } from '../../api/paid.js';


import '../card/card.js';
import '../learn/box.js';
import '../learn/memo.js';

import './cardset.html';


Meteor.subscribe("cardsets");
Meteor.subscribe("paid");
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
   Session.set('cardsetId', Router.current().params._id);

   if ($('#payment-form').length) {
     Meteor.call('getClientToken', function(error, clientToken) {
      if (error) {
        throw new Meteor.Error(err.statusCode, 'Error getting client token from braintree');
      } else {
        braintree.setup(clientToken, "dropin", {
          container: "payment-form",
          onPaymentMethodReceived: function (response) {
            $('#buyCardsetBtn').prop( "disabled", true );

            var nonce = response.nonce;

            Meteor.call('btCreateCustomer', function(error, success) {
              if (error) {
                throw new Meteor.Error('customer-creation-failed');
              } else {
                Meteor.call('createTransaction', nonce, Session.get('cardsetId'), function(error, success) {
                  if (error) {
                    throw new Meteor.Error('transaction-creation-failed');
                  } else {
                    Bert.alert(TAPi18n.__('cardset.money.bought'), 'success', 'growl-bottom-right');
                  }
                });
              }
            });
          }
        });
      }
    });
  }
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
    else if (Roles.userIsInRole(userId, 'lecturer')) {
      hasRole = true;
    }
    else if (Roles.userIsInRole(userId, 'university') && (cardsetKind  === 'edu' || cardsetKind === 'free')) {
      hasRole = true;
    }
    else if (cardsetKind === 'free') {
      hasRole = true;
    }
    else if (Paid.find({cardset_id:this._id, user_id:userId}).count() === 1) {
      hasRole = true;
    }

    return this.owner === Meteor.userId() || hasRole;
  },
  'isLecturerAndHasRequest': function() {
    return (Roles.userIsInRole(Meteor.userId(), 'lecturer') && this.request === true && this.owner !== Meteor.userId())
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
  },
  'click #acceptRequest': function() {
    Meteor.call("acceptProRequest", this._id);
    Bert.alert(TAPi18n.__('cardset.request.accepted'), 'success', 'growl-bottom-right');
  },
  'click #declineRequest': function() {
    var reason = $('#declineRequestReason').val();
    if (reason === '') {
      Bert.alert(TAPi18n.__('cardset.request.reason'), 'danger', 'growl-bottom-right');
    } else {
      Meteor.call("declineProRequest", this._id);
      Meteor.call("addNotification", this.owner, "Kartensatzfreischaltung nicht stattgegeben", reason);
      Bert.alert(TAPi18n.__('cardset.request.declined'), 'info', 'growl-bottom-right');
    }
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
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back" + index).html(html);
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

 Template.cardsetDetails.onCreated(function() {
  this.autorun(() => {
    this.subscribe('cards', Router.current().params._id);
  });
});


Template.cardsetDetails.helpers({
  cardsIndex: function(index) {
    return index + 1;
  },
  cardActive: function(index) {
    return 0 === index;
  },
  cardCountOne: function(cardset_id) {
    var count = Cardsets.find({
      _id: cardset_id
    }).quantity;
    return count !== 1;  },
  cardDetailsMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".detailfront" + index).html(html);
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".detailback" + index).html(html);
      });
  },
  getCardsCheckActive: function() {
    var query = Cards.find({cardset_id: this._id});

    query.observeChanges({
      removed: function() {
        $('#cardCarousel .item:first-child').addClass('active');
      }
    });
    return query;
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
 * cardsetPreview
 * ############################################################################
 */

 Template.cardsetPreview.onCreated(function() {
  this.autorun(() => {
    this.subscribe('cards', Router.current().params._id);
  });
});


 Template.cardsetPreview.rendered = function(){
    Meteor.subscribe("cards", Router.current().params._id);
}

Template.cardsetPreview.helpers({
  cardsIndex: function(index) {
    return index + 1;
  },
  cardActive: function(index) {
    return 0 === index;
  },
  cardCountOne: function(cardset_id) {
    var count = Cardsets.find({
      _id: cardset_id
    }).quantity;

    return count !== 1;
  },
  countPreviewCards: function(cardset_id) {
    var count = Cards.find({
      cardset_id: cardset_id
    }).count();

    return count;
  },
  cardDetailsMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".detailfront" + index).html(html);
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".detailback" + index).html(html);
      });
  },
  getCardsCheckActive: function() {
    var query = Cards.find({cardset_id: this._id});

    query.observeChanges({
      removed: function() {
        $('#cardCarousel .item:first-child').addClass('active');
      }
    });

    return query;
  }
});

Template.cardsetPreview.events({
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

 Template.cardsetInfo.onRendered(function() {
   $('[data-toggle="popover"]').popover({
     placement: 'right'
   });
});

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
        return '<span class="label label-warning">Private</span>';
      case "free":
        return '<span class="label label-default">Free</span>';
      case "edu":
        return '<span class="label label-success">Edu</span>';
      case "pro":
        return '<span class="label label-info">Pro</span>';
      default:
        return '<span class="label label-danger">Undefined!</span>';
      }
  },
  getStatus: function() {
    if (this.visible) {
      var kind = this.kind.charAt(0).toUpperCase() + this.kind.slice(1);
      return "Veröffentlicht (" + kind + ")";
    } else {
      if (this.kind === 'pro' && this.request === true) {
        return "In Überprüfung (Pro)";
      } else {
        return "Private";
      }
    }
  },
  isDisabled: function() {
    return (this.quantity < 5 || this.reviewed || this.request) ? 'disabled' : '';
  },
  hasAmount: function() {
    return this.kind === 'pro' || this.kind === 'edu';
  },
  getAmount: function() {
    return this.price + '€';
  },
  isPurchased: function() {
    return Paid.findOne({cardset_id:this._id}) !== undefined;
  },
  getDateOfPurchase: function() {
    return moment(Paid.findOne({cardset_id:this._id}).date).locale(getUserLanguage()).format('LL');
  },
  getReviewer: function() {
    var reviewer = Meteor.users.findOne(this.reviewer);
    return (reviewer !== undefined) ? reviewer.profile.name: undefined;
  },
  getLicense: function() {
    var licenseString = "";

    if (this.license.length > 0) {
      if (this.license.includes('by')) { licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" />'); }
      if (this.license.includes('nc')) { licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" />'); }
      if (this.license.includes('nd')) { licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" />'); }
      if (this.license.includes('sa')) { licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" />'); }

      return new Spacebars.SafeString(licenseString)
    } else {
      return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" />');
    }
  },
  isPublished: function() {
    if (this.kind === 'personal') {
      return false;
    } else {
      return true;
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
      cardset_id: cardset_id,
      user: Meteor.userId()
    }).count();
    if (count === 0) {
      var cardset = Cardsets.findOne({_id: cardset_id});
      Meteor.call("addRating", cardset_id, cardset.owner, rating);
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

Template.cardsetPublicateForm.onRendered(function() {
  $('#publicateModal').on('hidden.bs.modal', function() {
    var cardset = Cardsets.findOne(Session.get('cardsetId'));

    $('#publicateKind > label').removeClass('active');
    $('#publicateKind > label > input').filter(function() {
        return this.value === cardset.kind
    }).parent().addClass('active');
    Session.set('kind', cardset.kind);

    $('#publicatePrice').val(cardset.price);
  });
});

Template.cardsetPublicateForm.helpers({
  kindWithPrice: function(){
    if (Session.get('kind') === undefined) {
      return (this.kind === 'edu' || this.kind === 'pro');
    } else {
      return (Session.get('kind') === 'edu' || Session.get('kind') === 'pro');
    }
  },
  kindIsActive: function(kind) {
    return kind === this.kind;
  },
  priceIsSelected: function(price) {
    return price === this.price ? 'selected' : '';
  }
});

Template.cardsetPublicateForm.events({
  'click #cardsetPublicate': function(evt, tmpl) {
    var id = this._id;
    var kind = tmpl.find('#publicateKind > .active > input').value;
    var price = 0;
    var visible = true;
    var license = [];

    if (kind === 'edu' || kind === 'pro') {
      if (tmpl.find('#publicatePrice') !== null) {
        price = tmpl.find('#publicatePrice').value;
      }
      else {
        price = this.price;
      }
    }
    if (kind === 'personal') {
      visible = false;
      Meteor.call('updateLicense', id, license);
    }
    if (kind === 'pro') {
      visible = false;
      Meteor.call("makeProRequest", id);

      var text = "Neuer Pro-Kartensatz zur Überprüfung freigegeben";
      var type = "Pro-Überprüfung";
      var target = "lecturer";

      Meteor.call("addNotification", target, type, text);
      Bert.alert('Kartensatz zur Überprüfung freigegeben', 'success', 'growl-bottom-right');
    }

    Meteor.call("publicateCardset", id, kind, price, visible);
    $('#publicateModal').modal('hide');
  },
  'change #publicateKind': function(evt, tmpl){
    var kind = tmpl.find('#publicateKind > .active > input').value;
    Session.set('kind', kind);
  }
});

/**
 * ############################################################################
 * selectLicenseForm
 * ############################################################################
 */

 Template.selectLicenseForm.onRendered(function() {
   $('#selectLicenseModal').on('hidden.bs.modal', function() {
     var cardset = Cardsets.findOne(Session.get('cardsetId'));
     var license = cardset.license;

     $('#cc-modules > label').removeClass('active');
     $('#modulesLabel').css('color', '');
     $('#helpCC-modules').html('');

     if (license.includes('by')) { $('#cc-option0').addClass('active'); }
     if (license.includes('nc')) { $('#cc-option1').addClass('active'); }
     if (license.includes('nd')) { $('#cc-option2').addClass('active'); }
     if (license.includes('sa')) { $('#cc-option3').addClass('active'); }
   });
 });

 Template.selectLicenseForm.events({
   'click #licenseSave': function(evt, tmpl) {
     if ($("#cc-option2").hasClass('active') && $("#cc-option3").hasClass('active') || $("#cc-modules").children().hasClass('active') && !($("#cc-option0").hasClass('active'))) {
       $('#modulesLabel').css('color', '#b94a48');
       $('#helpCC-modules').html(TAPi18n.__('modal-dialog.wrongCombination'));
       $('#helpCC-modules').css('color', '#b94a48');
     }
     else {
       var license = [];

       if ($("#cc-option0").hasClass('active')) { license.push("by"); }
       if ($("#cc-option1").hasClass('active')) { license.push("nc"); }
       if ($("#cc-option2").hasClass('active')) { license.push("nd"); }
       if ($("#cc-option3").hasClass('active')) { license.push("sa"); }

       Meteor.call('updateLicense', this._id, license);
       $('#selectLicenseModal').modal('hide');
     }
   }
 });

 Template.selectLicenseForm.helpers({
   licenseIsActive: function(license) {
     var cardset = Cardsets.findOne(Session.get('cardsetId'));
     if (cardset !== undefined) {
       var licenses = cardset.license;

       if (licenses.includes(license)) return true;
     } else {
       return null;
     }
   }
 });
