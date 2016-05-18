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

    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        });
    }
});
