import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../util/routeNames";
import * as config from "../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../util/styles";
import {Fullscreen} from "../../../util/fullscreen";

FlowRouter.route('/firstLogin', {
	name: RouteNames.firstLogin,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../ui/firstLogin/firstLogin.js'),
			import("../../../ui/impressum/impressum.js"),
			Meteor.subscribe('defaultAppData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.firstLogin',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
	},
	action: function () {
		this.render(config.mainTemplate, 'firstLoginContent');
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
