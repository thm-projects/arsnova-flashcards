import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes.js";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Filter} from "../../../../util/filter";
import {UserPermissions} from "../../../../util/permissions";
import {MainNavigation} from "../../../../util/mainNavigation";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/all/cardsets', {
	name: RouteNames.alldecks,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('allCardsets'),
			Meteor.subscribe('paidCardsets'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.all.cardset',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "pool");
		Session.set('cardsetIndexResults', Cardsets.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
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

FlowRouter.route('/all/repetitorien', {
	name: RouteNames.allRepetitorien,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('allRepetitorien'),
			Meteor.subscribe('paidCardsets'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.all.rep',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "pool");
		Session.set('cardsetIndexResults', Cardsets.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		if (UserPermissions.isAdmin()) {
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
				redirect(RouteNames.alldecks);
			}
		}
	]
});
