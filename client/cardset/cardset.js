Meteor.subscribe("cardsets");

Session.setDefault('showCardsetForm', false);

Template.cardset.helpers({
  'showCardsetForm': function() {
    return Session.get('showCardsetForm');
  },
  'hasPermission': function() {
    return this.owner === Meteor.userId() || this.visible === true;
  }
});

Template.cardsetList.helpers({
  cardsetList: function() {
    return Cardsets.findOne(
      {_id:this._id},
      {fields: {'cards': 1}},
      {owner: Meteor.userId()});
  },
  cardsCount: function() {
    var cardCount = Cardsets.find({_id:this._id, cards:{$size:0}}).count();;
      console.log(cardCount);
    if (cardCount === 0)
      return true;
    else
      return false;


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
    var date = moment().locale(getUserLanguage()).format('LL');
    var visible = ('true' === tmpl.find('#editCardSetVisibility > .active > input').value);
    var ratings = ('true' === tmpl.find('#editCardSetRating > .active > input').value);
    Meteor.call("updateCardset", this._id, name, category, description, date, visible, ratings);
    Session.set('showCardsetForm', false);
  },
  'click #cardSetCancel': function(evt, tmpl) {
    Session.set('showCardsetForm', false);
  },
  'click #cardSetDelete': function(evt, tmpl) {
    Meteor.call("deleteCardset", this._id);
    Session.set('showCardsetForm', false);
    Router.go('created');;
  },
  'click .category': function(evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#editSetCategory').text(categoryName);
    tmpl.find('#editSetCategory').value = categoryId;
  }
});

Template.sidebarCardset.helpers({
  'isOwner': function() {
    return this.owner === Meteor.userId();
  }
});

Template.sidebarCardset.events({
  "click #set-details-controls-btn-newCard": function() {
    Router.go('newcard', {_id: this._id});
  }
});

Template.cardsetForm.helpers({
  'visible': function(visible) {
    return Cardsets.findOne(this._id).visible === visible;
  },
  'ratings': function(ratings) {
    return Cardsets.findOne(this._id).ratings === ratings;
  }
});
