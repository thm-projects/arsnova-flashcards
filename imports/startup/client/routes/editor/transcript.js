import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/personal/transcripts/edit/:card_id', {
	name: RouteNames.editTranscript,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/card/editor/editor.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetsTranscripts'),
			Meteor.subscribe('transcriptCard', params.card_id),
			Meteor.subscribe('myTranscriptBonus'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.transcript.edit',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter', "cardEditor");
		} else {
			FlowRouter.go('home');
		}
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'editCard', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});


FlowRouter.route('/personal/transcripts/new', {
	name: RouteNames.newTranscript,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/card/editor/editor.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetsTranscripts'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.transcript.new',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		if (ServerStyle.gotTranscriptsEnabled()) {
			Session.set('helpFilter', "cardEditor");
		} else {
			FlowRouter.go('home');
		}
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'newCard', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
