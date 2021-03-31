import "./index.html";
import {Template} from "meteor/templating";
import {CardsetNavigation} from "../../../../util/cardsetNavigation";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetNavigationIndex
 * ############################################################################
 */

Template.cardsetNavigationIndex.helpers({
	gotMultipleCards: function () {
		return this.quantity > 1;
	}
});

Template.cardsetNavigationIndex.events({
	"click .cardsetIndexBtn": function () {
		Session.set('showOnlyErrorReports', false);
		CardsetNavigation.goToIndex();
	}
});
