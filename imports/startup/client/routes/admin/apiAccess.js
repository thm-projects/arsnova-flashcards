import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";

FlowRouter.route('/admin/apiAccess', {
	name: RouteNames.admin_apiAccess,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/apiAccess/apiAccess.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('allCardsets'),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.api',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_apiAccess', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	}
});
