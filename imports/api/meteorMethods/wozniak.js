import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Wozniak } from '../subscriptions/wozniak';
import { Cardsets } from '../subscriptions/cardsets';
import { Bonus } from '../../util/bonus';
import { UserPermissions } from '../../util/permissions';
import { CardType } from '../../util/cardTypes';
import { Cards } from '../subscriptions/cards';

Meteor.methods({
  markWozniakAutoPDF(cardset_id, card_id) {
    check(cardset_id, String);
    check(card_id, String);

    Wozniak.update({
      cardset_id,
      card_id,
      user_id: Meteor.userId(),
    },
    {
      $set: {
        'viewedPDF': true,
      },
    });
  },
  /** Adds new cards to the learners list for super memo mode
   * @param {string} cardset_id - The ID of the cardset in which the user is learning
   * @return {Boolean} - Return true once the task is completed
   */
  addWozniakCards(cardset_id) {
    check(cardset_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id });
    const user_id = this.userId;
    if (!Meteor.userId() || Roles.userIsInRole(user_id, 'blocked') || Bonus.isInBonus(cardset._id, Meteor.userId()) || !UserPermissions.hasCardsetPermission(cardset_id)) {
      throw new Meteor.Error('not-authorized');
    } else {
      Meteor.call('initializeWorkloadData', cardset._id, Meteor.userId());
      if (cardset.shuffled) {
        let counter = 0;
        for (let i = 0; i < cardset.cardGroups.length; i++) {
          if (CardType.gotLearningModes(Cardsets.findOne(cardset.cardGroups[i]).cardType)) {
            counter++;
          }
        }
        if (counter === 0) {
          throw new Meteor.Error('not-authorized');
        }
      } else if (!CardType.gotLearningModes(cardset.cardType)) {
        throw new Meteor.Error('not-authorized');
      }
      let cards;
      let cardsetFilter = [cardset._id];
      if (cardset.shuffled) {
        cardsetFilter = cardset.cardGroups;
      }

      const existingItems = Wozniak.find({
        cardset_id: cardset._id,
        user_id,
      }, { fields: { card_id: 1 } }).fetch();
      const excludedCards = [];
      existingItems.forEach(function(existingItem) {
        excludedCards.push(existingItem.card_id);
      });

      const newItems = [];
      const nextDate = new Date();
      cards = Cards.find({
        _id: { $nin: excludedCards },
        cardset_id: { $in: cardsetFilter },
      }, { fields: { _id: 1 } }).fetch();
      cards.forEach(function(card) {
        newItems.push({
          card_id: card._id,
          cardset_id: cardset._id,
          user_id,
          ef: 2.5,
          interval: 0,
          reps: 0,
          nextDate,
          skipped: 0,
          viewedPDF: false,
        });
      });
      if (newItems.length > 0) {
        Wozniak.batchInsert(newItems);
      }
      Meteor.call('updateLearnerCount', cardset._id);
      Meteor.call('updateWorkloadCount', user_id);
      return true;
    }
  },
});
