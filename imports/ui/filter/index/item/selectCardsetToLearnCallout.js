import "./selectCardsetToLearnCallout.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";

/*
 * ############################################################################
 * filterItemSelectCardsetToLearnCallout
 * ############################################################################
 */

Template.filterItemSelectCardsetToLearnCallout.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		FlowRouter.go('learn');
	}
});
