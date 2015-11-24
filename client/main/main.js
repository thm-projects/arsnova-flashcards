//------------------------ LOGOUT EVENT

Template.main.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});


//------------------------ RETURNS USERNAME

Template.main.helpers ({
  getUsername: function(){
    if(Meteor.user()) {
      return Meteor.user().profile.name;
    }
  }
});
