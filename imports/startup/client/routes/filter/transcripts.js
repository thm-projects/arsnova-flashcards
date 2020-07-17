import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import {ServerStyle} from "../../../../api/styles";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Cards} from "../../../../api/subscriptions/cards";
import {Filter} from "../../../../api/filter";
import * as config from "../../../../config/routes";

FlowRouter.route('/transcripts/personal', {
	name: RouteNames.transcriptsPersonal,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		if (ServerStyle.gotSimplifiedNav()) {
			return [
				import ('../../../../ui/cardset/index/transcript/transcript.js'),
				import('../../../../ui/filter/filter.js'),
				Meteor.subscribe('defaultAppData'),
				Meteor.subscribe('myTranscriptCards'),
				Meteor.subscribe('myTranscriptBonus'),
				Meteor.subscribe('cardsetsTranscripts')
			];
		} else {
			return [
				import ('../../../../ui/cardset/index/transcript/transcript.js'),
				import('../../../../ui/filter/filter.js'),
				Meteor.subscribe('defaultAppData'),
				Meteor.subscribe('myTranscriptCards')
			];
		}
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.transcripts.personal',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter', "transcripts");
			Session.set('cardsetIndexResults', Cards.find().count());
			Filter.resetMaxItemCounter();
		} else {
			FlowRouter.go('home');
		}
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'filterIndex', data);
	}
});

FlowRouter.route('/transcripts/bonus', {
	name: RouteNames.transcriptsBonus,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import ('../../../../ui/cardset/index/transcript/transcript.js'),
			import('../../../../ui/filter/filter.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('myBonusTranscriptCards'),
			Meteor.subscribe('myTranscriptBonus'),
			Meteor.subscribe('cardsetsTranscripts')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.filter.transcripts.bonus',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter', "transcripts");
			Session.set('cardsetIndexResults', Cards.find().count());
			Filter.resetMaxItemCounter();
		} else {
			FlowRouter.go('home');
		}
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'filterIndex', data);
	},
	triggersEnter: [
		(context, redirect) => {
			if (ServerStyle.gotSimplifiedNav()) {
				redirect(RouteNames.transcriptsPersonal);
			}
		}
	]
});
