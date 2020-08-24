import "./admin/apiAccess.js";
import "./admin/dashboard.js";
import "./admin/general.js";
import "./admin/learningStatistics.js";
import "./admin/matomoStatistics.js";
import "./admin/notifications.js";
import "./admin/settings.js";
import "./admin/university.js";
import "./admin/user.js";
import "./cardset/cardset.js";
import "./cardset/editors.js";
import "./cardset/leitnerBonus.js";
import "./cardset/shuffle.js";
import "./cardset/transcriptBonus.js";
import "./demo/card.js";
import "./demo/index.js";
import "./editor/card.js";
import "./editor/transcript.js";
import "./filter/all.js";
import "./filter/personal.js";
import "./filter/public.js";
import "./filter/transcripts.js";
import "./filter/workload.js";
import "./impressum/about.js";
import "./impressum/agb.js";
import "./impressum/datenschutz.js";
import "./impressum/faq.js";
import "./impressum/help.js";
import "./impressum/impressum.js";
import "./impressum/learning.js";
import "./makingOf/card.js";
import "./makingOf/index.js";
import "./presentation/card.js";
import "./presentation/index.js";
import "./presentation/transcript.js";
import "./presentation/transcriptBonus.js";
import "./profile/billing.js";
import "./profile/fullscreen.js";
import "./profile/membership.js";
import "./profile/notifications.js";
import "./profile/requests.js";
import "./profile/settings.js";
import "./accessDenied.js";
import "./firstLogin.js";
import "./leitner.js";
import "./onBeforeAction.js";
import "./wozniak.js";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../util/routeNames";
import * as config from "../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../util/styles";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {Fullscreen} from "../../../util/fullscreen";

FlowRouter.route('/cardset', function () {
	FlowRouter.go('learn');
});

FlowRouter.notFound = {
	action: function() {
		FlowRouter.go('home');
	}
};

FlowRouter.route('/', {
	name: RouteNames.home,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('wordcloudCardsets'),
			Meteor.subscribe('userDataLandingPage')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.default',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: Session.get('wordcloudItem')});
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'welcome', data);
	},
	triggersEnter: [
		(context, redirect) => {
			Fullscreen.disable();
		}
	]
});
