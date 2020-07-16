import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

FlowRouter.route('/makingofcardslist', {
	name: RouteNames.makinglist,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import('../../../../ui/presentation/presentation.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('makingOfCardsets'),
			Meteor.subscribe('demoCards')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.default',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', "cardsetIndex");
		return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true});
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'makingOfCards', data);
	}
});
