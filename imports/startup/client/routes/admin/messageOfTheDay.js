import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {ServerStyle} from "../../../../util/styles";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/admin/messageOfTheDay', {
	name: RouteNames.admin_messageOfTheDay,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/messageOfTheDay/messageOfTheDay.js'),
			Meteor.subscribe("MessageOfTheDayAll")
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.messageOfTheDay',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_messageOfTheDay', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go(config.adminMainTemplate, 'home');
		}
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
