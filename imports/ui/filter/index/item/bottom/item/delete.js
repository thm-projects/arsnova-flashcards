import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./delete.html";

/*
 * ############################################################################
 * filterIndexItemBottomDelete
 * ############################################################################
 */

Template.filterIndexItemBottomDelete.events({
	'click .deleteCourseIteration': function (event) {
		Session.set('courseIterationId', $(event.target).data('id'));
	},
	'click .deleteCardset': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	}
});
