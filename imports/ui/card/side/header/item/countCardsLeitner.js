import {Session} from "meteor/session";
import "./countCardsLeitner.html";
import {LeitnerCardStats} from "../../../../../api/subscriptions/leitner/leitnerCardStats.js";


/*
 * ############################################################################
 * cardContentItemCountCardsLeitner
 * ############################################################################
 */

Template.cardContentItemCountCardsLeitner.helpers({
	countLeitner: function () {
		var maxIndex = LeitnerCardStats.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});
