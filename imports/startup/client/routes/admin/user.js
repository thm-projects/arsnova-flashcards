import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/admin/users', {
	name: RouteNames.admin_users,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/users/index.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('backendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.user.index',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_users', data);
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

FlowRouter.route('/admin/user/:_id', {
	name: RouteNames.admin_user,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/users/user.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('backendUserData')
		];
	},
	data: function (params) {
		document.title = TAPi18n.__('title.backend.user.user',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
		return Meteor.users.findOne({_id: params._id});
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_user', data);
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
