import {Session} from "meteor/session";
import "./countCardsReview.html";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../api/transcriptBonus";


/*
 * ############################################################################
 * cardContentItemCountCardsReview
 * ############################################################################
 */

Template.cardContentItemCountCardsReview.helpers({
	countReview: function () {
		let latestExpiredDeadline = TranscriptBonusList.getLatestExpiredDeadline(Router.current().params._id);
		let maxIndex = TranscriptBonus.find({
			cardset_id: Session.get('activeCardset')._id,
			rating: 0,
			date: {$lt: latestExpiredDeadline}
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});
