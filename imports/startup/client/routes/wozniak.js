import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../util/routeNames";
import * as config from "../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../util/styles";
import {MarkdeepEditor} from "../../../util/markdeepEditor";
import {Session} from "meteor/session";
import {AspectRatio} from "../../../util/aspectRatio";
import {Fullscreen} from "../../../util/fullscreen";

FlowRouter.route('/memo/:_id', {
	name: RouteNames.memo,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		Meteor.call("addWozniakCards", params._id);
		return [
			import('../../../ui/learn/learn.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('cardsetWorkload', params._id),
			Meteor.subscribe('cardsetCards', params._id),
			Meteor.subscribe('cardsetWozniak', params._id),
			Meteor.subscribe('learningPhaseBonus'),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.wozniak',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		Session.set('aspectRatioMode', AspectRatio.getDefault());
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'learnAlgorithmAccess', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.setMode();
		}
	]
});
