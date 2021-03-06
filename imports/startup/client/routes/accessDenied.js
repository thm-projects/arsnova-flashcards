import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../util/routeNames";
import * as config from "../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../util/styles";
import {Fullscreen} from "../../../util/fullscreen";

FlowRouter.route('/accessDenied', {
	name: RouteNames.accessDenied,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../ui/accessDenied/accessDenied.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.accessDenied',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'accessDenied', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
