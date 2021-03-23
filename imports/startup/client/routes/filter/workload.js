import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {LeitnerUserCardStats} from "../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {Filter} from "../../../../util/filter";
import * as config from "../../../../config/routes";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/learn', {
	name: RouteNames.learn,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('workloadCardsets'),
			Meteor.subscribe('paidCardsets'),
			Meteor.subscribe('userWorkload'),
			Meteor.subscribe('userLeitner'),
			Meteor.subscribe('userWozniak'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.workload',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "workload");
		Session.set('cardsetIndexResults', LeitnerUserCardStats.find().count() + Wozniak.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'filterIndex', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
