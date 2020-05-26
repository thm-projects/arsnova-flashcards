import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./selectCardsetButton.html";

/*
 * ############################################################################
 * filterItemSelectCardsetButton
 * ############################################################################
 */

Template.filterItemSelectCardsetButton.events({
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		FlowRouter.go('pool');
	}
});
