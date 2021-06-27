import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../util/styles";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {Filter} from "../../../../util/filter";
import {Cards} from "../../../../api/subscriptions/cards";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/cardset/:_id/transcripts/review', {
	name: RouteNames.presentationTranscriptReview,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetTranscriptBonusReview', params._id, Session.get('transcriptBonusReviewFilter')),
			Meteor.subscribe('cardsetTranscriptBonusCardsReview', params._id, Session.get('transcriptBonusReviewFilter')),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('transcriptBonusUserData', params._id),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.stats.transcripts',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		document.title = TAPi18n.__('title.default',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		MarkdeepEditor.changeMobilePreview(true);
		Filter.resetMaxItemCounter();
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		Session.set('cardsetIndexResults', Cards.find().count());
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'presentation', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});

FlowRouter.route('/cardset/:_id/transcripts', {
	name: RouteNames.transcriptBonus,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetTranscriptBonus', params._id),
			Meteor.subscribe('cardsetTranscriptBonusCards', params._id),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('transcriptBonusUserData', params._id)
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.stats.transcripts',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		MarkdeepEditor.changeMobilePreview(true);
		Filter.resetMaxItemCounter();
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		Session.set('cardsetIndexResults', Cards.find().count());
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'cardsetIndexTranscript', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
