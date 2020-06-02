//------------------------ IMPORTS
import "./newCard.html";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

/*
 * ############################################################################
 * cardsetNavigationNewCard
 * ############################################################################
 */

Template.cardsetNavigationNewCard.events({
	"click #newCardBtn": function () {
		FlowRouter.go('newCard', {_id: this._id});
	}
});
