import {Meteor} from "meteor/meteor";
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
		if (Route.isCardset()) {
			Session.set('aspectRatioMode', AspectRatio.getDefault());
			Session.set('activeCardSide', undefined);
			Session.set('isDirectCardsetIndexView', true);
			Router.go('presentationlist', {_id: Router.current().params._id});
		} else if (Route.isDemo()) {
			Session.set('isDirectCardsetIndexView', false);
			Router.go('demolist');
		} else if (Route.isMakingOf()) {
			Session.set('isDirectCardsetIndexView', false);
			Router.go('makinglist');
		}  else {
			Session.set('isDirectCardsetIndexView', false);
			Router.go('presentationlist', {
				_id: Router.current().params._id
			});
		}
	}
};
