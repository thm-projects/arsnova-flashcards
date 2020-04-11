import {UserPermissions} from "../permissions";

Meteor.methods({
	getMatomoToken: function () {
		if (UserPermissions.gotBackendAccess()) {
			return Meteor.settings.matomo.MATOMO_TOKEN;
		}
	}
});
