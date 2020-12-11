import { check } from 'meteor/check';
import { UserPermissions } from '../../util/permissions';
import { MessageOfTheDay } from '../subscriptions/messageOfTheDay';

Meteor.methods({
  insertMessageOfTheDay(message) {
    if (UserPermissions.gotBackendAccess()) {
      check(message.dateCreated, Date);
      check(message.dateUpdated, Date);
      check(message.expirationDate, Date);
      check(message.publishDate, Date);
      check(message.locationType, Number);
      MessageOfTheDay.insert(message);
    }
  },
  removeMessageOfTheDay(id) {
    if (UserPermissions.gotBackendAccess()) {
      MessageOfTheDay.remove({
        _id: id,
      });
    }
  },
  updateMessageOfTheDay(message) {
    if (UserPermissions.gotBackendAccess()) {
      MessageOfTheDay.update({
        _id: message.id,
      }, {
        $set: {
          subject: message.subject,
          content: message.content,
          dateUpdated: new Date(),
          locationType: message.locationType,
          expirationDate: message.expirationDate,
          publishDate: message.publishDate,
        },
      });
    }
  },
});
