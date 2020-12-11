import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { UserPermissions } from '../../util/permissions';
import { AdminSettings } from '../subscriptions/adminSettings';

Meteor.methods({
  updateWordcloudPomodoroSettings(enableWordcloudPomodoro) {
    check(enableWordcloudPomodoro, Boolean);

    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error('not-authorized');
    }
    AdminSettings.upsert({
      name: 'wordcloudPomodoroSettings',
    },
    {
      $set: {
        enabled: enableWordcloudPomodoro,
      },
    });
  },
  updateMailSettings(enableMails) {
    check(enableMails, Boolean);

    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error('not-authorized');
    }
    AdminSettings.upsert({
      name: 'mailSettings',
    },
    {
      $set: {
        enabled: enableMails,
      },
    });
  },
  updatePushSettings(enablePush) {
    check(enablePush, Boolean);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }
    AdminSettings.upsert({
      name: 'pushSettings',
    },
    {
      $set: {
        enabled: enablePush,
      },
    });
  },
  changeNotificationTarget(target) {
    check(target, String);

    if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
      throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.users.findOne({ _id: target });
    if (user !== undefined && user.email !== undefined && user.email !== '' && user.profile.givenname !== undefined && user.profile.givenname !== '' && user.profile.birthname !== undefined && user.profile.birthname !== '') {
      AdminSettings.upsert({
        name: 'testNotifications',
      },
      {
        $set: {
          target,
        },
      });
      return true;
    }
    return false;
  },
  changePlantUMLServerTarget(target) {
    check(target, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }
    AdminSettings.upsert({
      name: 'plantUMLServerSettings',
    },
    {
      $set: {
        url: target,
      },
    });
    return true;
  },
});
