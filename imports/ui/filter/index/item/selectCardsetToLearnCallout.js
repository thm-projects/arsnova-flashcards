import "./selectCardsetToLearnCallout.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * filterItemSelectCardsetToLearnCallout
 * ############################################################################
 */

Template.filterItemSelectCardsetToLearnCallout.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		Router.go('learn');
	}
});
