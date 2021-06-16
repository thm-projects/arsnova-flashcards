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
import {CardsetNavigation} from "../../../util/cardsetNavigation";
import {AnswerUtilities} from "../../../util/answers";
import {Bonus} from "../../../util/bonus";
import {PomodoroTimer} from "../../../util/pomodoroTimer";

FlowRouter.route('/box/:_id', {
	name: RouteNames.box,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function (params) {
		CardsetNavigation.addToLeitner(params._id);
		return [
			import('../../../ui/learn/learn.js'),
			Meteor.subscribe('defaultAppData'),
			Meteor.subscribe('cardset', params._id),
			Meteor.subscribe('paidCardset', params._id),
			Meteor.subscribe('cardsetCards', params._id),
			Meteor.subscribe('latestLeitnerCardsetWorkload', params._id),
			Meteor.subscribe('latestLeitnerCardsetCards', params._id),
			Meteor.subscribe('latestLeitnerCardsetActivationDay', params._id),
			Meteor.subscribe('latestLeitnerCardsetPerformanceHistory', params._id),
			Meteor.subscribe('latestLeitnerCardsetLearningPhase', params._id),
			Meteor.subscribe('frontendUserData')
		];
	},
	data: function (params) {
		let cardset = Cardsets.findOne({_id: params._id});
		if (cardset !== undefined) {
			document.title = TAPi18n.__('title.cardset.leitner',  {app: ServerStyle.getAppTitle(), name: cardset.name}, ServerStyle.getServerLanguage());
		}
		AnswerUtilities.setNewRandomizedNumber();
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
	],
	triggersExit: [
		(context, redirect) => {
			if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
				PomodoroTimer.updateServerTimerIntervalStop();
			}
		}
	]
});
