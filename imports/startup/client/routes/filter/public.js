import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes.js";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {MainNavigation} from "../../../../api/mainNavigation";
import {Filter} from "../../../../api/filter";

FlowRouter.route('/public/cardsets', {
	name: RouteNames.pool,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('poolCardsets'),
			Meteor.subscribe('paidCardsets'),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.public.cardset',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "pool");
		Session.set('cardsetIndexResults', Cardsets.find().count());
	},
	action: function (params, qs, data) {
		if (ServerStyle.gotNavigationFeature("public.cardset.enabled")) {
			this.render(config.mainTemplate, 'filterIndex', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	}
});

FlowRouter.route('/public/repetitorien', {
	name: RouteNames.repetitorium,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('repetitoriumCardsets'),
			Meteor.subscribe('paidCardsets'),
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.public.rep',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "repetitorium");
		Session.set('cardsetIndexResults', Cardsets.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		if (ServerStyle.gotNavigationFeature("public.repetitorium.enabled")) {
			this.render(config.mainTemplate, 'filterIndex', data);
		} else {
			MainNavigation.setLoginTarget(false);
			FlowRouter.go('home');
		}
	},
	triggersEnter: [
		(context, redirect) => {
			if (ServerStyle.gotSimplifiedNav()) {
				redirect(RouteNames.pool);
			}
		}
	]
});
