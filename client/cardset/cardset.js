Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

Session.setDefault('showCardsetPictureForm', false);

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
        $(".front"+index).html(html);
        var src = $('.listitem img').attr('src');
        var alt = $('.listitem img').attr('alt');
        $('.listitem img').replaceWith($('<a class="card-front btn-showPictureModal" href="#" data-val="'+src+'" data-alt="'+alt+'"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back"+index).html(html);
        var src = $('.listitem img').attr('src');
        var alt = $('.listitem img').attr('alt');
        $('.listitem img').replaceWith($('<a class="card-back btn-showPictureModal" href="#" data-val="'+src+'" data-alt="'+alt+'"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
  },
  showCardsetPictureForm: function() {
    return Session.get('showCardsetPictureForm');
  }
});

Template.cardsetList.events({
  'click .listitem .card-front, click .listitem .card-back': function(evt, tmpl) {
    Session.set('showCardsetPictureForm', true);
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    setTimeout(function() {
      $("#pictureModal .modal-title").html(alt);
      $("#setdetails-pictureModal-body").html("<img src='"+src+"' alt='"+alt+"'>");
    }, 0);
  },
  'click #pictureModal .close': function(evt, tmpl) {
    Session.set('showCardsetPictureForm', false);
  }
});

/**
 * ############################################################################
 * cardsetDetails
 * ############################################################################
 */

Template.cardsetDetails.helpers({
  cardsIndex: function(index) {
    return index+1;
  },
  cardActive: function(index) {
    return 0 === index;
  },
  cardCountOne: function(cardset_id) {
    var count = Cards.find({cardset_id: cardset_id}).count();
    if(count === 1)
      return false;
    else
      return true;
  },
  cardDetailsMarkdown: function(front, back, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".detailfront"+index).html(html);
        var src = $('.detailfront'+index+' img').attr('src');
        var alt = $('.detailfront'+index+' img').attr('alt');
        $('.detailfront'+index+' img').replaceWith($('<a class="card-detailfront btn-showPictureModal" href="#" data-val="'+src+'" data-alt="'+alt+'"><i class="glyphicon glyphicon-picture"></i></a>'));

      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".detailback"+index).html(html);
        var src = $('.detailback'+index+' img').attr('src');
        var alt = $('.detailback'+index+' img').attr('alt');
        $('.detailback'+index+' img').replaceWith($('<a class="card-detailback btn-showPictureModal" href="#" data-val="'+src+'" data-alt="'+alt+'"><i class="glyphicon glyphicon-picture"></i></a>'));
      });
  },
  showCardsetPictureForm: function() {
    return Session.get('showCardsetPictureForm');
  }
});

Template.cardsetDetails.events({
  "click #learnBox": function() {
    Router.go('box', {_id: this._id});
  },
  "click #learnMemo": function() {
    Router.go('memo', {_id: this._id});
  },
  "click .box": function() {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    }
    else if ($(".cardback-symbol").css('display') == 'none') {
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
    evt.preventDefault();
    Session.set('showCardsetPictureForm', true);
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    setTimeout(function() {
      $("#pictureModal .modal-title").html(alt);
      $("#setdetails-pictureModal-body").html("<img src='"+src+"' alt='"+alt+"'>");
    }, 0);
    evt.stopPropagation();
  },
  'click #pictureModal .close': function(evt, tmpl) {
    Session.set('showCardsetPictureForm', false);
  }
});

/**
 * ############################################################################
 * sidebarCardset
 * ############################################################################
 */

Template.sidebarCardset.events({
  "click #set-details-controls-btn-newCard": function() {
    Router.go('newcard', {_id: this._id});
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
