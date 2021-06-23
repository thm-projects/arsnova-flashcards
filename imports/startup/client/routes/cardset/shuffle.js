import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {ServerStyle} from "../../../../util/styles";
import {Session} from "meteor/session";
import {Filter} from "../../../../util/filter";
import {Fullscreen} from "../../../../util/fullscreen";

FlowRouter.route('/cardset/:_id/editshuffle', {
	name: RouteNames.editshuffle,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		return [
			import('../../../../ui/cardset/cardset.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('editShuffleCardsets', params._id),
			Meteor.subscribe('frontendUserData'),
			Meteor.subscribe('learningPhaseActiveBonus')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined && cardset.shuffled) {
			document.title = TAPi18n.__('title.cardset.shuffle',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		Session.set('helpFilter', "shuffle");
		Filter.resetMaxItemCounter();
		Session.set('cardsetIndexResults', Cardsets.find().count());
		return cardset;
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'filterIndexShuffle', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
