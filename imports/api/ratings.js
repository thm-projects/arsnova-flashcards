import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Experience } from './experience.js';

export const Ratings = new Mongo.Collection("ratings");

if (Meteor.isServer) {
  Meteor.publish("ratings", function() {
    return Ratings.find();
  });
}

Meteor.methods({
  addRating: function(cardset_id, rating) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Ratings.insert({
      cardset_id: cardset_id,
      user: Meteor.userId(),
      rating: rating
    });
    Experience.insert({
      type: 4,
      value: 1,
      date: new Date(),
      owner: Meteor.userId()
    });
    Meteor.call('checkLvl');
  }
});
