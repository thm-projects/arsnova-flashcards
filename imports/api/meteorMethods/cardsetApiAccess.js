import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { APIAccess } from '../subscriptions/cardsetApiAccess';
import { Cardsets } from '../subscriptions/cardsets.js';
import { UserPermissions } from '../../util/permissions';

Meteor.methods({
  /**
   * Create new API access for a given cardset.
   * Autogenerates token.
   * @param {String} cardsetId - Database id of the cardset to be accessed via API
   */
  newAPIAccess(cardsetId) {
    check(cardsetId, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    } else {
      const cardset = Cardsets.findOne({ _id: cardsetId });
      if (!cardset) {
        throw new Meteor.Error(`no access to a cardset with id: ${cardsetId}`);
      } else {
        const token = Random.secret();
        const apiToken = {
          cardset_id: cardsetId,
          token,
        };
        APIAccess.insert(apiToken);
      }
    }
  },
  /**
   * Delete selected API access from database if user is auhorized.
   * @param {String} apiAccessId - Database id of the api access token to be deleted
   */
  deleteAPIAccess(apiAccessId) {
    check(apiAccessId, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    } else {
      APIAccess.remove(apiAccessId);
    }
  },
});
