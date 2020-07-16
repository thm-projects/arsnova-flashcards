import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {Leitner} from "../../../../api/subscriptions/leitner";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {Filter} from "../../../../api/filter";
import * as config from "../../../../config/routes";

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
			Meteor.subscribe('userData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.workload',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "workload");
		Session.set('cardsetIndexResults', Leitner.find().count() + Wozniak.find().count());
		Filter.resetMaxItemCounter();
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'filterIndex', data);
	}
});
