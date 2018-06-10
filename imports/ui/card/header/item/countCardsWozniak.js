import {Session} from "meteor/session";
import "./countCardsWozniak.html";
import {Wozniak} from "../../../../api/learned";


/*
 * ############################################################################
 * cardHeaderItemCountCardsWozniak
 * ############################################################################
 */

Template.cardHeaderItemCountCardsWozniak.helpers({
	cardHeaderItemCountCardsWozniak: function () {
		var maxIndex = Wozniak.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});
