import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../util/styles";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {Session} from "meteor/session";
import * as config from "../../../../config/routes.js";

FlowRouter.route('/cardset/:_id', {
	name: RouteNames.cardsetdetailsid,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('cardsetUserRating', params._id),
			Meteor.subscribe('cardsetWorkload', params._id),
			Meteor.subscribe('cardsetCards', params._id),
			Meteor.subscribe('cardsetWozniak', params._id),
			Meteor.subscribe('userData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			if (cardset.shuffled) {
				document.title = TAPi18n.__('title.cardset.rep',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			} else {
				document.title = TAPi18n.__('title.cardset.cardset',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			}
		}
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'cardsetAccess', data);
	}
});

FlowRouter.route('/cardset/:_id/card/:card_id', {
	name: RouteNames.cardsetcard,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('cardsetUserRating', params._id),
			Meteor.subscribe('cardsetWorkload', params._id),
			Meteor.subscribe('cardsetCards', params._id),
			Meteor.subscribe('cardsetWozniak', params._id),
			Meteor.subscribe('userData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			if (cardset.shuffled) {
				document.title = TAPi18n.__('title.cardset.rep',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			} else {
				document.title = TAPi18n.__('title.cardset.cardset',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
			}
		}
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		Session.set('activeCard', params._id);
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'cardsetAccess', data);
	}
});
