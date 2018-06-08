import {Session} from "meteor/session";
import "./headerItemCountCardsLeitner.html";
import {Leitner} from "../../../../api/learned";


/*
 * ############################################################################
 * cardHeaderItemCountCardsLeitner
 * ############################################################################
 */

Template.cardHeaderItemCountCardsLeitner.helpers({
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
