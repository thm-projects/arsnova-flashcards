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
    var isOwner = (this.userId === owner);

    var hasBought = Paid.findOne({cardset_id: cardset_id, user_id:this.userId}) !== undefined;

    var isFree = (cardset !== undefined) ? cardset.kind === 'free' : undefined;
    var isVisible = (cardset !== undefined) ? cardset.visible : undefined;

    if (Roles.userIsInRole(this.userId, 'blocked')) {
      return null;
    }
    else if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      return Cards.find();
    }
    else if ((isOwner || Roles.userIsInRole(this.userId, ['lecturer'])) || //checks if the user is an owner or a lecturer
		(isVisible && (hasBought || isFree || Roles.userIsInRole(this.userId, ['pro'])))) //or if it's visible and free, bought or the user is a pro user
    {
      return Cards.find({cardset_id: cardset_id});
    }
    else if (isVisible)
    {
      var count = Cards.find({cardset_id:cardset_id}).count();
      var limit = count * 0.1;

      if (limit < 2) {
        limit = 2;
      } else if (limit > 15) {
        limit = 15;
      }

      return Cards.find({cardset_id: cardset_id},{limit: limit});
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
    if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.insert({
      front: front,
      back: back,
      cardset_id: cardset_id
    });
    Cardsets.update(cardset_id, {
      $set: {
        quantity: Cards.find({cardset_id: cardset_id}).count(),
        dateUpdated: new Date()
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

    if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
      throw new Meteor.Error("not-authorized");
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
        quantity: Cards.find({cardset_id: card.cardset_id}).count(),
        dateUpdated: new Date()
      }
    });
    Learned.remove({
      card_id: card_id
    });
  },
  deleteCardAdmin: function(card_id) {
    var card = Cards.findOne({ _id : card_id });

    if (card !== undefined) {
      var cardset = Cardsets.findOne(card.cardset_id);

      if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
        throw new Meteor.Error("not-authorized");
      }

      Cards.remove(card_id);
      Cardsets.update(card.cardset_id, {
        $set: {
          quantity: Cards.find({cardset_id: card.cardset_id}).count(),
          dateUpdated: new Date()
        }
      });
      Learned.remove({
        card_id: card_id
      });
    }
  },
  updateCard: function(card_id, front, back) {
    var card = Cards.findOne(card_id);
    var cardset = Cardsets.findOne(card.cardset_id);

    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      // Make sure the user is logged in and is authorized
      if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
        throw new Meteor.Error("not-authorized");
      }
    }

    Cards.update(card_id, {
      $set: {
        front: front,
        back: back
      }
    });
    Cardsets.update(card.cardset_id, {
      $set: {
        dateUpdated: new Date()
      }
    });
  }
});
