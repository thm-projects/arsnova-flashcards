Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe('ratings', function onReady() {
  Session.set('ratingsLoaded', true);
});

/**
 * ############################################################################
 * cardset
 * ############################################################################
 */

Template.cardset.events({
  'click #cardSetSave': function(evt, tmpl) {
    var name = tmpl.find('#editSetName').value;

    if (tmpl.find('#editSetCategory').value === undefined) {
      tmpl.find('#editSetCategory').value = Cardsets.findOne(this._id).category;
    }
    var category = tmpl.find('#editSetCategory').value;
    var description = tmpl.find('#editSetDescription').value;
    var visible = ('true' === tmpl.find('#editCardSetVisibility > .active > input').value);
    var ratings = ('true' === tmpl.find('#editCardSetRating > .active > input').value);
    Meteor.call("updateCardset", this._id, name, category, description, visible, ratings);
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
  }
});

Template.cardsetList.events({
  'click .listitem .card-front, click .listitem .card-back': function(evt, tmpl) {
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    $("#pictureModal .modal-title").html(alt);
    $("#setdetails-pictureModal-body").html("<img src='" + src + "' alt='" + alt + "'>");
  }
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
  'click .item.active .block a': function(evt, tmpl) {
    evt.stopPropagation();
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    $("#pictureModal .modal-title").html(alt);
    $("#setdetails-pictureModal-body").html("<img src='" + src + "' alt='" + alt + "'>");
    $('#pictureModal').modal('show');
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
  "click #set-details-controls-btn-newCard": function() {
    Router.go('newCard', {
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
  }
});

/**
 * ############################################################################
 * cardsetForm
 * ############################################################################
 */

Template.cardsetForm.helpers({
  'visible': function(visible) {
    return Cardsets.findOne(this._id).visible === visible;
  },
  'ratings': function(ratings) {
    return Cardsets.findOne(this._id).ratings === ratings;
  }
});
