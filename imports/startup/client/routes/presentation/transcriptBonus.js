import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Cards} from "../../../../api/subscriptions/cards";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/presentation-transcripts-bonus/:card_id', {
	name: RouteNames.presentationTranscriptBonus,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/presentation/presentation.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('transcriptCard', params.card_id),
			Meteor.subscribe('myTranscriptBonus'),
			Meteor.subscribe('cardsetTranscriptMyBonus', params.card_id),
			Meteor.subscribe('learningPhaseBonus'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function (params) {
		document.title = TAPi18n.__('title.transcript.presentation',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter',undefined);
			return Cards.findOne(params.card_id);
		} else {
			FlowRouter.go('home');
		}
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


FlowRouter.route('/presentation-transcripts-bonus/:_id/:card_id', {
	name: RouteNames.presentationTranscriptBonusCardset,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/presentation/presentation.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('transcriptCard', params.card_id),
			Meteor.subscribe('cardsetTranscriptBonus', params._id)
		];
	},
	data: function (params) {
		document.title = TAPi18n.__('title.transcript.presentation',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter',undefined);
			return Cards.findOne(params.card_id);
		} else {
			FlowRouter.go('home');
		}
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
