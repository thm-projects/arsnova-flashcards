Session.setDefault('showCardsetForm', false);

Template.cardset.helpers ({
  showCardsetForm: function() {
    return Session.get('showCardsetForm');
  }
})

Template.cardset.events({
  'click .editSet': function(evt, tmpl){
    Session.set('showCardsetForm', true);
  },
  'click #cardSetSave': function(evt, tmpl){
    Session.set('showCardsetForm', false);
  },
  'click #cardSetCancel': function(evt, tmpl){
    Session.set('showCardsetForm', false);
  },
  'click #cardSetDelete': function(evt, tmpl){
    Cardsets.remove(this._id);
    Session.set('showCardsetForm', false);
    Router.go('created');;
  },
  'click .category': function (evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#newSetCategory').text(categoryName);
    tmpl.find('#newSetCategory').value = categoryId;
  }
})
