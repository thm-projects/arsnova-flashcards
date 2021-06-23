import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes.js";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Filter} from "../../../../util/filter";
import {MainNavigation} from "../../../../util/mainNavigation";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/personal/cardsets', {
	name: RouteNames.create,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('myCardsets'),
			Meteor.subscribe('learningPhaseActiveBonus')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.personal.cardset',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "create");
		Session.set('cardsetIndexResults', Cardsets.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		if (ServerStyle.gotNavigationFeature("personal.cardset.enabled")) {
			this.render(config.mainTemplate, 'filterIndex', data);
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


FlowRouter.route('/personal/repetitorien', {
	name: RouteNames.personalRepetitorien,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('personalRepetitorien'),
			Meteor.subscribe('frontendUserData'),
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.personal.rep',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "create");
		Session.set('cardsetIndexResults', Cardsets.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		if (ServerStyle.gotNavigationFeature("personal.repetitorium.enabled")) {
			this.render(config.mainTemplate, 'filterIndex', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
			if (ServerStyle.gotSimplifiedNav()) {
				redirect(RouteNames.create);
			}
		}
	]
});
