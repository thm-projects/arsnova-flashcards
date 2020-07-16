import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";

FlowRouter.route('/cardset/:_id/stats', {
	name: RouteNames.cardsetstats,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('cardsetUserRating', params._id),
			Meteor.subscribe('cardsetWorkload', params._id)
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.stats.leitner',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		Session.set('helpFilter', "bonusStatistics");
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'cardsetLearnActivityStatistic', data);
	}
});
