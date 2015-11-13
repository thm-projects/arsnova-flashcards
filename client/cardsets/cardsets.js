Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

Session.setDefault('showCardsetsForm', false);
Session.setDefault('cardsetSort', {
  name: 1
});

/**
 * ############################################################################
 * created
 * ############################################################################
 */
Template.created.helpers({
  cardsetList: function() {
    return Cardsets.find({
      owner: Meteor.userId()
    }, {
      sort: Session.get('cardsetSort')
    });
  }
});

/**
 * ############################################################################
 * cardsets
 * ############################################################################
 */

Template.cardsets.helpers({
  showCardsetsForm: function() {
    return Session.get('showCardsetsForm');
  }
});

Template.cardsets.events({
  'click .saveSet, click #setListEmpty': function(evt, tmpl) {
    Session.set('showCardsetsForm', true);
  },
  'click .save': function(evt, tmpl) {
    var name = tmpl.find('#newSetName').value;
    var category = tmpl.find('#newSetCategory').value;
    var description = tmpl.find('#newSetDescription').value;
    var date = new Date();
    var visible = ('true' === tmpl.find('#newCardSetVisibility > .active > input').value);
    var ratings = ('true' === tmpl.find('#newCardSetRating > .active > input').value);
    Meteor.call("addCardset", name, category, description, date, visible, ratings);
    Session.set('showCardsetsForm', false);
  },
  'click .cancel': function(evt, tmpl) {
    Session.set('showCardsetsForm', false);
  },
  'click .category': function(evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#newSetCategory').text(categoryName);
    tmpl.find('#newSetCategory').value = categoryId;
  }
});
