import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {ServerStyle} from "../../../../util/styles";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";

FlowRouter.route('/admin/publicCardsets', {
	name: RouteNames.admin_publicCardsets,
	whileWaiting: function () {
		this.render(config.adminMainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/admin/publicCardsets/publicCardsets.js')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.backend.publicCardsets',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
			this.render(config.adminMainTemplate, 'admin_publicCardsets', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go(config.adminMainTemplate, 'home');
		}
	}
});
