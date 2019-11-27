import {Session} from "meteor/session";
import "./countCardsLeitner.html";
import {Leitner} from "../../../../../api/subscriptions/leitner.js";


/*
 * ############################################################################
 * cardContentItemCountCardsLeitner
 * ############################################################################
 */

Template.cardContentItemCountCardsLeitner.helpers({
	countLeitner: function () {
		var maxIndex = Leitner.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});
