//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './welcome.html';

//------------------------ LOGIN EVENT

Template.welcome.events({
    'click #facebook': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
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

    'click #cas': function(event) {
        Meteor.loginWithCas({}, function(err){
            if (err) {
                throw new Meteor.Error("CAS login failed");
            }
        });
    },

    'click #logout': function() {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        });
    }
});

Template.welcome.onRendered(function() {
  if(Meteor.settings.public.displayLoginButtons.displayFacebook)
  {
    $('.panel-footer').append('<a id="facebook" href=""><img src="img/social_facebook_box_white.png" /></a>');
  }
  if(Meteor.settings.public.displayLoginButtons.displayTwitter)
  {
    $('.panel-footer').append('<a id="twitter" href=""><img src="img/social_twitter_box_white.png" /></a>');
  }
  if(Meteor.settings.public.displayLoginButtons.displayGoogle)
  {
    $('.panel-footer').append('<a id="google" href=""><img src="img/social_google_box_white.png" /></a>');
  }
  if(Meteor.settings.public.displayLoginButtons.displayCas)
  {
    $('.panel-footer').append('<a id="cas" href=""><img src="img/social_cas_box_white.png" /></a>');
  }
});
