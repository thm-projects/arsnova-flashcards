import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Cardsets } from './cardsets.js';
import { Experience } from './experience.js';
import { Learned } from './learned.js';

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
  Meteor.publish("cards", function() {
    return Cards.find();
  });
}

CardsSchema = new SimpleSchema({
  front: {
    type: String,
    max: 10000
  },
  back: {
    type: String,
    max: 10000
  },
  cardset_id: {
    type: String
  }
});

Cards.attachSchema(CardsSchema);

Meteor.methods({
  addCard: function(cardset_id, front, back) {
    // Make sure the user is logged in and is authorized
    var cardset = Cardsets.findOne(cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.insert({
      front: front,
      back: back,
      cardset_id: cardset_id
    });
    Experience.insert({
      type: 3,
      value: 2,
      date: new Date(),
      owner: Meteor.userId()
    });
    Meteor.call('checkLvl');
  },
  deleteCard: function(card_id) {
    // Make sure the user is logged in and is authorized
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.remove(card_id);
    Learned.remove({
      card_id: card_id
    });
  },
  updateCard: function(card_id, front, back) {
    // Make sure the user is logged in and is authorized
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.update(card_id, {
      $set: {
        front: front,
        back: back
      }
    });
  }
});
