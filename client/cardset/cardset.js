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
  }
})
