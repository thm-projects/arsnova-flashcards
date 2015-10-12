Template.welcome.events({
    'click #facebook': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else {
              var currentRoute = Router.current().route.getName();
              if(currentRoute == "welcome"){
                Router.go("main");
              }
            }
        });
    },

    'click #twitter': function(event) {
        Meteor.loginWithTwitter({}, function(err){
            if (err) {
                throw new Meteor.Error("Twitter login failed");
            }
        });
    },

    'click #google': function(event) {
        Meteor.loginWithGoogle({}, function(err){
            if (err) {
                throw new Meteor.Error("Google login failed");
            }
        });
    },

    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});
