import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/profile/:_id/fullscreen', {
	name: RouteNames.profileFullscreen,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/profile/profile.js'),
			import('../../../../ui/profile/view/fullscreen/fullscreen.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.profile.fullscreen',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "fullscreen");
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'profile', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
			if (!ServerStyle.gotFullscreenSettingsAccess()) {
				redirect(RouteNames.home);
			}
		}
	]
});
