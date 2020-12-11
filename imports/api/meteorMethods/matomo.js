import { UserPermissions } from '../../util/permissions';

Meteor.methods({
  getMatomoToken() {
    if (UserPermissions.gotBackendAccess()) {
      return Meteor.settings.matomo.MATOMO_TOKEN;
    }
  },
});
