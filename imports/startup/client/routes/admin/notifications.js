import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/admin/notifications', {
	name: RouteNames.admin_notifications,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/notifications/notifications.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('backendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.notifications',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_notifications', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
