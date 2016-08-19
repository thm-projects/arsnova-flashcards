import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Paid = new Mongo.Collection("paid");

if (Meteor.isServer) {
  Meteor.publish("paid", function() {
     if (this.userId)
    {
      return Paid.find({user_id: this.userId});
    }
  });
}

Meteor.methods({
  addPaid: function(cardset_id, amount) {
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Paid.insert({
      cardset_id: cardset_id,
      user_id: Meteor.userId(),
      date: new Date(),
      amount: amount
    });
  }
});
