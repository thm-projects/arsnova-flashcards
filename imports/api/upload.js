import { Meteor } from 'meteor/meteor';

import { Cardsets } from './cardsets.js';
import { Cards } from './cards.js';

Meteor.methods({
  parseUpload: function(data, cardset_id) {
    var cardset = Cardsets.findOne(cardset_id);
    if (!Meteor.userId() || cardset.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (item.front !== "") {
        Cards.insert({
          front: item.front,
          back: item.back,
          cardset_id: cardset_id
        });
      }
    }
  }
});
