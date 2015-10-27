Template.main.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});


//------------------------ DISPLAY USER NAME

// Returns username
Template.registerHelper("usernameFromId", function () {
    var service = _.keys(Meteor.user().services)[0];
    // Google and Facebook
    if (service == 'google' || service == 'facebook') {
      return Meteor.user().services[service].name;
    }
    // Twitter
    else if (service == 'twitter') {
      return Meteor.user().services[service].screenName;
    }
    // CAS
    else {
      return Meteor.user().profile.name;
    }
});
