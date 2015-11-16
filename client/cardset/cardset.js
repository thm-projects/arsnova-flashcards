Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

Session.setDefault('showCardsetForm', false);

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
      });
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back"+index).html(html);
      });
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
    console.log(count);
    if(count === 1)
      return false;
    else
      return true;
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
  "click #leftCarouselControl": function() {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    }
  },
  "click #rightCarouselControl": function() {
    if ($(".cardfront-symbol").css('display') == 'none') {
      $(".cardfront-symbol").css('display', "");
      $(".cardback-symbol").css('display', "none");
      $(".cardfront").css('display', "");
      $(".cardback").css('display', "none");
    }
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
