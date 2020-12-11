import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Cardsets } from '../subscriptions/cardsets.js';
import { UserPermissions } from '../../util/permissions';
import { Ratings } from '../subscriptions/ratings';

Meteor.methods({
  rateCardset(cardset_id, rating) {
    check(cardset_id, String);
    check(rating, Number);

    if (this.userId && UserPermissions.isNotBlockedOrFirstLogin() && !UserPermissions.isOwner(Cardsets.findOne({ _id: cardset_id }).owner)) {
      if (Ratings.findOne({ cardset_id, user_id: this.userId })) {
        Ratings.update({ cardset_id, user_id: this.userId }, {
          $set: {
            rating,
          },
        });
      } else {
        Ratings.insert({
          cardset_id,
          user_id: this.userId,
          rating,
        });
      }
      Meteor.call('updateCardsetRating', cardset_id);
    } else {
      throw new Meteor.Error('not-authorized');
    }
  },
  updateCardsetRating(cardset_id) {
    check(cardset_id, String);
    if (Meteor.isServer) {
      const ratings = Ratings.find({ cardset_id }).fetch();
      let sum = 0;
      for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i].rating;
      }
      if (sum !== 0) {
        sum = (sum / ratings.length).toFixed(2);
      }
      Cardsets.update(cardset_id, {
        $set: {
          rating: sum,
          raterCount: ratings.length,
        },
      });
    }
  },
});
