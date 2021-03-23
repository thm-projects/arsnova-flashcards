import {Session} from "meteor/session";
import "./countCardsLeitner.html";
import {LeitnerUserCardStats} from "../../../../../api/subscriptions/leitner/leitnerUserCardStats.js";


/*
 * ############################################################################
 * cardContentItemCountCardsLeitner
 * ############################################################################
 */

Template.cardContentItemCountCardsLeitner.helpers({
	countLeitner: function () {
		var maxIndex = LeitnerUserCardStats.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});
