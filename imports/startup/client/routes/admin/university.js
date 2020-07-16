import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {UserPermissions} from "../../../../api/permissions";
import {MainNavigation} from "../../../../api/mainNavigation";

FlowRouter.route('/admin/university', {
	name: RouteNames.admin_university,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/university/university.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_university', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	}
});
