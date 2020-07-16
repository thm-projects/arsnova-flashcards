import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";


FlowRouter.route('/presentationlist/:_id', {
	name: RouteNames.presentationlist,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/presentation/presentation.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('cardsetWorkload', params._id),
			Meteor.subscribe('cardsetCards', params._id),
			Meteor.subscribe('userData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			if (cardset.shuffled) {
				document.title = TAPi18n.__('title.cardset.index.rep',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			} else {
				document.title = TAPi18n.__('title.cardset.index.cardset',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			}
		}
		Session.set('helpFilter', "cardsetIndex");
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'presentation', data);
	}
});
