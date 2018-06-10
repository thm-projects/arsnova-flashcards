import {Session} from "meteor/session";
import "./edit.html";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/cardsets";
/*
 * ############################################################################
 * cardHeaderItemEdit
 * ############################################################################
 */

Template.cardHeaderItemEdit.helpers({
	isShuffledCardset: function () {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', shuffled: true}).shuffled;
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
		}
	}
});

Template.cardHeaderItemEdit.events({
	"click #editCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
	}
});
