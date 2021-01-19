import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../util/styles";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {Session} from "meteor/session";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/presentation/:_id', {
	name: RouteNames.presentation,
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
			Meteor.subscribe('cardsetCards', params._id)
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.presentation',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'presentation', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.setMode();
		}
	]
});

FlowRouter.route('/presentation/:_id/:card_id', {
	name: RouteNames.presentation,
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
			Meteor.subscribe('cardsetCards', params._id)
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.presentation',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'presentation', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.setMode();
		}
	]
});
