import "./index.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {AspectRatio} from "../../../../api/aspectRatio";

/*
 * ############################################################################
 * cardsetNavigationIndex
 * ############################################################################
 */

Template.cardsetNavigationIndex.events({
	"click .cardsetIndexBtn": function () {
		Session.set('aspectRatioMode', AspectRatio.getDefault());
		Session.set('activeCardSide', undefined);
		Router.go('presentationlist', {_id: this._id});
	}
});
