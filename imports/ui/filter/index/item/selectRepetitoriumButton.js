import {Session} from "meteor/session";
import "./selectRepetitoriumButton.html";

/*
 * ############################################################################
 * filterItemSelectRepetitoriumButton
 * ############################################################################
 */

Template.filterItemSelectRepetitoriumButton.events({
	'click #browseShuffledCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('repetitorium');
	}
});
