Session.setDefault('showCardsetsForm', false);

Template.cardsets.helpers ({
  showCardsetsForm: function() {
    return Session.get('showCardsetsForm');
  }
})

Template.created.helpers ({
  cardsetList: function() {
    return Cardsets.find();
  }
})

Template.cardsets.events({
  'click .saveSet': function(evt, tmpl){
    Session.set('showCardsetsForm', true);
  },
  'click .save': function(evt, tmpl){
    var name = tmpl.find('#newSetName').value;
    var category = tmpl.find('#newSetCategory').value;
    var description = tmpl.find('#newSetDescription').value;
    addCardset(name, category, description);
    Session.set('showCardsetsForm', false);
  },
  'click .cancel': function(evt, tmpl){
    Session.set('showCardsetsForm', false);
  }
})

var addCardset = function(name, category, description) {
  Cardsets.insert({name: name, category: category, description: description});
}
