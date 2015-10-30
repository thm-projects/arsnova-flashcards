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
    return Meteor.user().profile.name;
  }
});
