import "./index.html";
import {Template} from "meteor/templating";
import {CardsetNavigation} from "../../../../util/cardsetNavigation";

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
		CardsetNavigation.goToIndex();
	}
});
