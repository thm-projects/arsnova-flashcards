Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe('ratings', function onReady() {
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

Template.cardset.helpers({
  'onEditmodalClose': function(id) {
    Session.set('previousName', Cardsets.findOne(id).name);
    Session.set('previousDescription', Cardsets.findOne(id).description);
    Session.set('previousCategory', Cardsets.findOne(id).category);
    Session.set('previousVisible', Cardsets.findOne(id).visible);
    Session.set('previousRatings', Cardsets.findOne(id).ratings);

    var previousCategory = Cardsets.findOne(id).category;
    var categoryId = previousCategory.toString();

    if (categoryId.length == 1) categoryId = "0" + categoryId;

    var category = Categories.findOne(categoryId);
    if (category !== undefined) {
      Session.set('previousCategoryName', category.name);
    }
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
      var visible = ('true' === tmpl.find('#editCardSetVisibility > .active > input').value);
      var ratings = ('true' === tmpl.find('#editCardSetRating > .active > input').value);
      Meteor.call("updateCardset", this._id, name, category, description, visible, ratings);
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
    var previousVisible = Session.get('previousVisible');
    var previousRatings = Session.get('previousRatings');

    if (previousName != $('#editSetName').val()) {
      $('#editSetName').val(previousName);
      $('#editSetNameLabel').css('color', '');
      $('#editSetName').css('border-color', '');
    }
    if (previousDescription != $('#editSetDescription').val()) {
      $('#editSetDescription').val(previousDescription);
      $('#editSetDescriptionLabel').css('color', '');
      $('#editSetDescription').css('border-color', '');
    }
    if (previousCategoryName != $('#editSetCategory').html()) {
      $('#editSetCategory').html(previousCategoryName);
    }
    if (previousVisible != $('#editCardSetVisibility > .active > input').val()) {
      if (previousVisible) {
        $('#visibilityoption1').removeClass('active');
        $('#visibilityoption2').addClass('active');
      } else {
        $('#visibilityoption2').removeClass('active');
        $('#visibilityoption1').addClass('active');
      }
    }
    if (previousRatings != $('#editCardSetRating > .active > input').val()) {
      if (previousRatings) {
        $('#ratingoption2').removeClass('active');
        $('#ratingoption1').addClass('active');
      } else {
        $('#ratingoption1').removeClass('active');
        $('#ratingoption2').addClass('active');
      }
    }
  });
});

Template.cardsetForm.helpers({
  'visible': function(visible) {
    return Cardsets.findOne(this._id).visible === visible;
  },
  'ratings': function(ratings) {
    return Cardsets.findOne(this._id).ratings === ratings;
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
        var src = $('.listitem img').attr('src');
        var alt = $('.listitem img').attr('alt');
        $('.listitem img').replaceWith($('<a class="card-front btn-showPictureModal" data-toggle="modal" data-target="#pictureModal" href="#" data-val="' + src + '" data-alt="' + alt + '"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back" + index).html(html);
        var src = $('.listitem img').attr('src');
        var alt = $('.listitem img').attr('alt');
        $('.listitem img').replaceWith($('<a class="card-back btn-showPictureModal" data-toggle="modal" data-target="#pictureModal" href="#" data-val="' + src + '" data-alt="' + alt + '"><i class="glyphicon glyphicon-picture"></i></a>'));
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
  'click .listitem .card-front, click .listitem .card-back': function(evt, tmpl) {
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    $("#pictureModal .modal-title").html(alt);
    $("#setdetails-pictureModal-body").html("<img src='" + src + "' alt='" + alt + "'>");
  },
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
    if (count === 1)
      return false;
    else
      return true;
  },
  cardDetailsMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".detailfront" + index).html(html);
        var src = $('.detailfront' + index + ' img').attr('src');
        var alt = $('.detailfront' + index + ' img').attr('alt');
        $('.detailfront' + index + ' img').replaceWith($('<a class="card-detailfront btn-showPictureModal" data-toggle="modal" data-target="#pictureModal" data-val="' + src + '" data-alt="' + alt + '" style="cursor:pointer"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".detailback" + index).html(html);
        var src = $('.detailback' + index + ' img').attr('src');
        var alt = $('.detailback' + index + ' img').attr('alt');
        $('.detailback' + index + ' img').replaceWith($('<a class="card-detailback btn-showPictureModal" data-toggle="modal" data-target="#pictureModal" data-val="' + src + '" data-alt="' + alt + '" style="cursor:pointer"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
  }
});

Template.cardsetDetails.events({
  "click .box": function() {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    } else if ($(".cardback-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "none");
      $(".cardback-symbol").css('display', "");
      $(".cardfront").css('display', "none");
      $(".cardback").css('display', "");
    }
  },
  "click #leftCarouselControl, click #rightCarouselControl": function(evt) {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    }
  },
  'click .item.active .block .btn-showPictureModal': function(evt, tmpl) {
    evt.stopPropagation();
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    $("#pictureModal .modal-title").html(alt);
    $("#setdetails-pictureModal-body").html("<img src='" + src + "' alt='" + alt + "'>");
    $('#pictureModal').modal('show');
  },
  'click .item.active .block a': function() {
    evt.stopPropagation();
  }
});

/**
 * ############################################################################
 * sidebarCardset
 * ############################################################################
 */

Template.sidebarCardset.helpers({
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
    var owner = Cardsets.findOne(this._id).owner;
    return count !== 0 || owner === Meteor.userId();
  }
});

Template.sidebarCardset.events({
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
  'click #rating': function(event, template) {
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
  'click #usr-profile2': function() {
    Router.go('profile', {
      _id: this.owner
    });
  }
});

/**
 * ############################################################################
 * cardButtons
 * ############################################################################
 */

Template.cardButtons.events({
  "click #set-details-controls-btn-newCard": function() {
    Router.go('newCard', {
      _id: this._id
    });
  },
  'click #set-details-controls-btn-exportCards': function() {
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

      if (cards.length - 1 != card) {
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
        Meteor.call('parseUpload', res, cardset_id, function(error, response) {
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
        complete: function(results, file) {
          Meteor.call('parseUpload', results.data, cardset_id, function(error, response) {
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
