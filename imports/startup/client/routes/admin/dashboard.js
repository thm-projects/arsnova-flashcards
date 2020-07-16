import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {UserPermissions} from "../../../../api/permissions";
import {MainNavigation} from "../../../../api/mainNavigation";

FlowRouter.route('/admin/dashboard', {
	name: RouteNames.admin_dashboard,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/dashboard/dashboard.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe("serverInventory"),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.dashboard',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_dashboard', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	}
});
