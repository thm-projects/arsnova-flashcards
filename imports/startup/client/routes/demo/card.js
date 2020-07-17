import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {CardVisuals} from "../../../../util/cardVisuals";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

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
		if(ServerStyle.gotDemoAutoFullscreen() && !CardVisuals.isFullscreen()) {
			setTimeout(function () {
				CardVisuals.toggleFullscreen();
			}, 1000);
		}
		this.render(config.mainTemplate, 'demo', data);
	}
});

FlowRouter.route('/demolist', {
	name: RouteNames.demolist,
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
		document.title = TAPi18n.__('title.welcome.demo.index',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "cardsetIndex");
		return Cardsets.findOne({kind: 'demo', name: "DemoCardset", shuffled: true});
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'demo', data);
	}
});
