import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {WebPushNotifications} from "../../../../api/webPushSubscriptions";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";

FlowRouter.route('/admin/settings', {
	name: RouteNames.admin_settings,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/settings/settings.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.settings',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		WebPushNotifications.subscribeForPushNotification();
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_settings', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	}
});
