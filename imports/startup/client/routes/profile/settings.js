import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";

FlowRouter.route('/profile/:_id/settings', {
	name: RouteNames.profileSettings,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/profile/profile.js'),
			import('../../../../ui/profile/view/settings.js'),
			Meteor.subscribe('defaultAppData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.profile.settings',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "settings");
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'profile', data);
	}
});
