Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

Session.setDefault('showCardsetForm', false);
Session.setDefault('showCardsetPictureForm', false);

/**
 * ############################################################################
 * cardset
 * ############################################################################
 */

Template.cardset.helpers({
  'showCardsetForm': function() {
    return Session.get('showCardsetForm');
  }
});

Template.cardset.events({
  'click .editSet': function(evt, tmpl) {
    Session.set('showCardsetForm', true);
  },
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
    Session.set('showCardsetForm', false);
  },
  'click #cardSetCancel': function(evt, tmpl) {
    Session.set('showCardsetForm', false);
  },
  'click #cardSetDelete': function(evt, tmpl) {
    Meteor.call("deleteCardset", this._id);
    Session.set('showCardsetForm', false);
    Router.go('created');
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
  'click .listitem a': function(evt, tmpl) {
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
        $(".cardfront"+index).html(html);
        if($(".cardfront"+index+" img").length > 0)
        {
          $(".pictureDetailfront"+index).css('display', "");
        }
        var src = $('.cardfront'+index+' img').attr('src');
        var alt = $('.cardfront'+index+' img').attr('alt');
        $(".pictureDetailfront"+index).data('val', src);
        $(".pictureDetailfront"+index).data('alt', alt);
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".cardback"+index).html(html);
        var src = $('.cardback'+index+' img').attr('src');
        var alt = $('.cardback'+index+' img').attr('alt');
        $(".pictureDetailback"+index).data('val', src);
        $(".pictureDetailback"+index).data('alt', alt);
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
  "click .box": function(evt) {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".detailfront").css('display', "");
      $(".detailback").css('display', "none");
      if($(evt.currentTarget).find(".detailfront img").length > 0)
      {
        $(evt.currentTarget).find(".picFront").css('display', "");
      }
      $(evt.currentTarget).find(".picBack").css('display', "none");
    }
    else if ($(".cardback-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "none");
      $(".cardback-symbol").css('display', "");
      $(".detailfront").css('display', "none");
      $(".detailback").css('display', "");
      if($(evt.currentTarget).find(".detailback img").length > 0)
      {
        $(evt.currentTarget).find(".picBack").css('display', "");
      }
      $(evt.currentTarget).find(".picFront").css('display', "none");
    }
  },
  "click #leftCarouselControl, click #rightCarouselControl": function(evt) {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".detailfront").css('display', "");
      $(".detailback").css('display', "none");

      var cur = $(evt.currentTarget).prevAll();

      if(cur.find('.item.active .detailfront img').length > 0)
      {
        cur.find(".item.active .picFront").css('display', "");
      }

      cur.find(".picBack").css('display', "none");
    }
  },
  'click .item.active .picFront, click .item.active .picBack': function(evt, tmpl) {
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
