import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Cardsets } from '../subscriptions/cardsets.js';
import { exportCards } from '../../util/export.js';
import { exportAuthorName } from '../../util/userData';

Meteor.methods({
  exportCards(cardset_id, exportWithIds = false) {
    check(cardset_id, String);
    check(exportWithIds, Boolean);
    const cardset = Cardsets.findOne(cardset_id);
    if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) || cardset.shuffled) {
      throw new Meteor.Error('not-authorized');
    }
    return exportCards(cardset._id, true, exportWithIds);
  },
  exportCardset(cardset_id) {
    check(cardset_id, String);
    const cardset = Cardsets.findOne({
      _id: cardset_id,
    }, {
      fields: {
        'cardGroups': 0,
        '_id': 0,
      },
    });
    if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
      throw new Meteor.Error('not-authorized');
    }
    if (cardset.originalAuthorName === undefined || (cardset.originalAuthorName.birthname === undefined && cardset.originalAuthorName.legacyName === undefined)) {
      cardset.originalAuthorName = exportAuthorName(cardset.owner);
    }
    let cardsetString = JSON.stringify(cardset, null, 2);
    const cardString = exportCards(cardset_id, false);
    if (cardString.length) {
      cardsetString += (`, ${cardString}`);
    }
    return `[${cardsetString}]`;
  },
});
