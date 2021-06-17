import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/cardset/:_id/newcard', {
	name: RouteNames.newCard,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/card/editor/editor.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetsEditMode', params._id),
			Meteor.subscribe('editorCards', params._id),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.newCard',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		Session.set('helpFilter', "cardEditor");
		return cardset;
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

FlowRouter.route('/cardset/:_id/editcard/:card_id', {
	name: RouteNames.editCard,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/card/editor/editor.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardsetsEditMode', params._id),
			Meteor.subscribe('editorCards', params._id)
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.editCard',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		Session.set('helpFilter', "cardEditor");
		return cardset;
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
