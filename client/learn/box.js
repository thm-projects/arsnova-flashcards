/**
 * ############################################################################
 * box
 * ############################################################################
 */

Template.box.rendered = function(){
  /*
  Überprüfe ob Nutzer den Kartensatz bereits gelernt hat
    Wenn ja: Nichts zu tun
    Wenn nicht: Füge Nutzer zum Kartensatz hinzu und lege alle Karten in die erste Box

  */
  console.log("Hallo");
};

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
 * boxMain
 * ############################################################################
 */

Template.boxMain.helpers({
  isFront: function() {
    isFront = Session.get('isFront');
    return isFront === true;
  }
});

Template.boxMain.events({
  "click .box": function() {
    isFront = Session.get('isFront');
    if (isFront === true) {
      Session.set('isFront', false);
    } else {
      Session.set('isFront', true);
    }
  },
  "click #known": function() {
    Session.set('isFront', true);
  },
  "click #notknown": function() {
    Session.set('isFront', true);
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
    Session.set('isFront', true);
    var selectedBox = Session.get('selectedBox');
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
