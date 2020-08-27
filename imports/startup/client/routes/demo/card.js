import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Fullscreen} from "../../../../util/fullscreen";
import {PomodoroTimer} from "../../../../util/pomodoroTimer";
import {MainNavigation} from "../../../../util/mainNavigation";

FlowRouter.route('/demo', {
	name: RouteNames.demo,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/impressum/pages/demo/demo.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('demoCardsets'),
			Meteor.subscribe('demoCards')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.welcome.demo.presentation',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'demo', data);
	},
	triggersEnter: [
		(context, redirect) => {
			if(ServerStyle.gotDemoAutoFullscreen() && !Meteor.user() && !MainNavigation.isGuestLoginActive()) {
				Fullscreen.enable();
			} else {
				Fullscreen.setMode();
			}
			setTimeout(function () {
				PomodoroTimer.start();
			}, 250);
		}
	]
});
