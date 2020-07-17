import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {WebPushNotifications} from "./webPushSubscriptions";
import {Session} from "meteor/session";
import {Route} from "./route";
import {AspectRatio} from "./aspectRatio";

export let CardsetNavigation = class CardsetNavigation {
	/**
	 * Add the current user to the leitner algorithm.
	 */
	static addToLeitner (cardset_id) {
		WebPushNotifications.subscribeForPushNotification();
		Meteor.call('addToLeitner', cardset_id);
	}

	static goToIndex () {
		Session.set('filterIndexSelectMode', undefined);
		if (Route.isCardset()) {
			Session.set('aspectRatioMode', AspectRatio.getDefault());
			Session.set('activeCardSide', undefined);
			Session.set('isDirectCardsetIndexView', true);
			FlowRouter.go('presentationlist', {_id: FlowRouter.getParam('_id')});
		} else if (Route.isDemo()) {
			Session.set('isDirectCardsetIndexView', false);
			FlowRouter.go('demolist');
		} else if (Route.isMakingOf()) {
			Session.set('isDirectCardsetIndexView', false);
			FlowRouter.go('makinglist');
		}  else {
			Session.set('isDirectCardsetIndexView', false);
			FlowRouter.go('presentationlist', {
				_id: FlowRouter.getParam('_id')
			});
		}
	}
};
