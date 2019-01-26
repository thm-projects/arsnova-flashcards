import {Session} from "meteor/session";
import "./selectCardsetButton.html";

/*
 * ############################################################################
 * filterItemSelectCardsetButton
 * ############################################################################
 */

Template.filterItemSelectCardsetButton.events({
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('pool');
	}
});
