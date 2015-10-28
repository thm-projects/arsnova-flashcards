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
    var date = moment().locale(getUserLanguage()).format('LLL');
    addCardset(name, category, description, date);
    Session.set('showCardsetsForm', false);
  },
  'click .cancel': function(evt, tmpl){
    Session.set('showCardsetsForm', false);
  },
  'click .category': function (evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#newSetCategory').text(categoryName);
    tmpl.find('#newSetCategory').value = categoryId;
  }
})

var addCardset = function(name, category, description, date) {
  Cardsets.insert({name: name, category: category, description: description, date: date});
}
