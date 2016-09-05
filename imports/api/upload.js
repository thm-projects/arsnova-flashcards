import { Meteor } from 'meteor/meteor';

import { Cardsets } from './cardsets.js';
import { Cards } from './cards.js';

Meteor.methods({
  parseUpload: function(data, cardset_id) {
    var cardset = Cardsets.findOne(cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
      throw new Meteor.Error("not-authorized");
    }

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (item.front === undefined || item.front === "") {
        throw new Meteor.Error("entry number: " + i, "front missing");
      }
      else if (item.back === undefined || item.back === "") {
        throw new Meteor.Error("entry number: " + i, "back missing");
      }
    }

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      var front, back;
      try {
          // If the string is UTF-8, this will work and not throw an error.
          front = decodeURIComponent(escape(item.front));
          back = decodeURIComponent(escape(item.back));
      } catch (e) {
          // If it isn't, an error will be thrown, and we can asume that we have an ISO string.
          front = item.front;
          back = item.back;
      }

      if (item.front !== "") {
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
      }
    }
  }
});
