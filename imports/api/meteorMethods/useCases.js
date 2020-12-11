import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UserPermissions } from '../../util/permissions';
import { Cardsets } from '../subscriptions/cardsets';

Meteor.methods({
  /**
   * Whitelist the cardset for the Use Cases modal
   * @param {String} id - ID of the cardset to be updated
   * @param {Boolean} status - Use Cases status for the cardset: true = in Use Case modal, false = not in Use Case Modal
   * */
  updateUseCaseStatus(id, status) {
    check(id, String);
    check(status, Boolean);

    if (UserPermissions.gotBackendAccess()) {
      Cardsets.update(id, {
        $set: {
          useCase: {
            enabled: status,
            priority: 0,
          },
          dateUpdated: new Date(),
          lastEditor: Meteor.userId(),
        },
      });
      return id;
    }
    throw new Meteor.Error('not-authorized');
  },

  getUseCaseCardsets() {
    const query = { 'useCase.enabled': true };
    return Cardsets.find(query, {
      sort: { 'useCase.priority': 1, 'name': 1 },
      fields: { 'description': 0, 'useCase.enabled': 0 },
    }).fetch();
  },
});
