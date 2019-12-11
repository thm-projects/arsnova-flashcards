import "./index.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {AspectRatio} from "../../../../api/aspectRatio";

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
		Session.set('aspectRatioMode', AspectRatio.getDefault());
		Session.set('activeCardSide', undefined);
		Session.set('isDirectCardsetIndexView', true);
		Router.go('presentationlist', {_id: this._id});
	}
});
