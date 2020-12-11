import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { AccountUtils } from '../../util/accounts';

if (Meteor.isServer) {
  Meteor.methods({
    accountExists(username) {
      check(username, String);
      return AccountUtils.exists(username);
    },

    mailExists(mail) {
      check(mail, String);
      return AccountUtils.mailExists(mail);
    },
  });
}
