import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Cardsets } from './cardsets.js';
import { Experience } from './experience.js';
import { Learned } from './learned.js';

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
  Meteor.publish("cards", function(cardset_id) {
    if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      return Cards.find();
    }
    else if (this.userId)
    {
      if (cardset_id !== undefined) {
        return Cards.find({cardset_id: {$in: Cardsets.find({_id: cardset_id, $or: [{visible: true}, {owner: this.userId}]}).map(function(doc){return doc._id})}});
      }
      else {
        return Cards.find({cardset_id: {$in: Cardsets.find({$or: [{visible: true}, {owner: this.userId}]}).map(function(doc){return doc._id})}});
      }
    }
  });
}

var CardsSchema = new SimpleSchema({
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
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);
    console.log(cardset);

    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
    }

    var countCards = Cards.find({cardset_id:cardset._id}).count();
    if (countCards <= 5) {
      Cardsets.update(cardset._id, {
        $set: {
          kind: 'personal',
          reviewed: false,
          request: false,
          visible: false
        }
      });
    }

    Cards.remove(card_id);
    Learned.remove({
      card_id: card_id
    });
  },
  updateCard: function(card_id, front, back) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      // Make sure the user is logged in and is authorized
      var card = Cards.findOne(card_id);
      var cardset = Cardsets.findOne(card.cardset_id);
      if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
    }

    Cards.update(card_id, {
      $set: {
        front: front,
        back: back
      }
    });
  }
});
