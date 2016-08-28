import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Cardsets } from './cardsets.js';
import { Experience } from './experience.js';
import { Learned } from './learned.js';
import { Paid } from './paid.js';


export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
  Meteor.publish("cards", function(cardset_id) {
    var cardset = Cardsets.findOne(cardset_id);

    var owner = (cardset !== undefined) ? cardset.owner : undefined;
    var isOwner = this.userId === owner;

    var hasBought = Paid.findOne({cardset_id: cardset_id, user_id:this.userId}) !== undefined;

    var isFree = (cardset !== undefined) ? cardset.kind === 'free' : undefined;

    if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      return Cards.find();
    }
    else if (isOwner || hasBought || isFree || Roles.userIsInRole(this.userId, ['pro']))
    {
      return Cards.find({cardset_id: {$in: Cardsets.find({_id: cardset_id, $or: [{visible: true}, {owner: this.userId}]}).map(function(doc){return doc._id})}});
    }
    else {
      var count = Cards.find({cardset_id:cardset_id}).count();
      var limit = count * 0.1;

      if (limit < 2) {
        limit = 2;
      } else if (limit > 15) {
        limit = 15;
      }

      return Cards.find({},{limit: limit});
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
    Cardsets.update(cardset_id, {
      $set: {
        quantity: Cards.find({cardset_id: cardset_id}).count()
      }
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
    Cardsets.update(card.cardset_id, {
      $set: {
        quantity: Cards.find({cardset_id: card.cardset_id}).count()
      }
    });
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
