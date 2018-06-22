import {Session} from "meteor/session";
import "./swapOrder.html";

/*
 * ############################################################################
 * cardHeaderItemSwapOrder
 * ############################################################################
 */

Template.cardHeaderItemSwapOrder.helpers({
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	}
});

Template.cardHeaderItemSwapOrder.events({
	"click .swapOrder": function () {
		if (Session.get('reverseViewOrder')) {
			Session.set('reverseViewOrder', false);
		} else {
			Session.set('reverseViewOrder', true);
		}
		Session.set('isQuestionSide', true);
	}
});
