Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

/**
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
  getDecks: function() {
    var id = parseInt(this._id);
    return Cardsets.find({
      category: id,
      visible: true
    });
  }
});

/**
 * ############################################################################
 * helpers
 * ############################################################################
 */

Template.pool.helpers({
  getCount: function(id) {
    return Cardsets.find({
      category: parseInt(id),
      visible: true
    }).count();
  }
});
