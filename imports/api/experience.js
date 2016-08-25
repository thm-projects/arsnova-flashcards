import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Experience = new Mongo.Collection("experience");

if (Meteor.isServer) {
  Meteor.publish("experience", function() {
    return Experience.find();
  });
}

Meteor.methods({
  checkLvl: function() {
    var pts = 0;
    var points = 0;
    var output = 0;
    var lvl = 1;

    var allXp = Experience.find({
      owner: Meteor.userId()
    });
    allXp.forEach(function(xp) {
      pts = pts + xp.value;
    });
    while (pts > output) {
      points += Math.floor(lvl + 30 * Math.pow(2, lvl / 10));
      output = Math.floor(points / 4);
      if (pts >= output) {
	       lvl++;
      }
    }
    Meteor.users.update(Meteor.userId(), {
      $set: {
        lvl: lvl
      }
    });
  },
  addExperience: function(type, value) {
    Experience.insert({
      type: type,
      value: value,
      date: new Date(),
      owner: Meteor.userId()
    });
    Meteor.call('checkLvl');
  }
});
