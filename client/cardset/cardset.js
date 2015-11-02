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

Template.cardset.events({
  'click .editSet': function(evt, tmpl) {
    Session.set('showCardsetForm', true);
  },
  'click #cardSetSave': function(evt, tmpl) {
    var name = tmpl.find('#editSetName').value;
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

Template.cardsetForm.helpers({
  'visible': function(visible) {
    return Cardsets.findOne(this._id).visible === visible;
  },
  'ratings': function(ratings) {
    return Cardsets.findOne(this._id).ratings === ratings;
  }
});
