import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {ServerStyle} from "../../../../api/styles";
import {UserPermissions} from "../../../../api/permissions";
import {MainNavigation} from "../../../../api/mainNavigation";

FlowRouter.route('/admin/matomoStatistics', {
	name: RouteNames.admin_matomoStatistics,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/matomo/matomoStatistics.js')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.matomo',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_matomoStatistics', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go(config.adminMainTemplate, 'home');
		}
	}
});
