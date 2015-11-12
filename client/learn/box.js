/**
 * ############################################################################
 * box
 * ############################################################################
 */

Template.box.helpers({
  boxSelected: function() {
    var selectedBox = Session.get('selectedBox');
    return selectedBox !== null;
  },
  isFinish: function() {
    return false;
  }
});

/**
 * ############################################################################
 * boxSide
 * ############################################################################
 */

Template.boxSide.events({
  "click .learn-box": function(event, template) {
    var box = $(event.currentTarget).val();
    Session.set('selectedBox', box);
    var selectedBox = Session.get('selectedBox');
    console.log(selectedBox);
  }
});

Template.boxSide.helpers({
  selectedBox: function(boxId) {
    var selectedBox = Session.get('selectedBox');
    if (boxId == selectedBox) {
      return "active";
    }
  }
});

Template.boxSide.destroyed = function() {
  Session.set('selectedBox', null);
};
