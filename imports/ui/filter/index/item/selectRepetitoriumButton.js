import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./selectRepetitoriumButton.html";

/*
 * ############################################################################
 * filterItemSelectRepetitoriumButton
 * ############################################################################
 */

Template.filterItemSelectRepetitoriumButton.events({
	'click #browseShuffledCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		FlowRouter.go('repetitorium');
	}
});
