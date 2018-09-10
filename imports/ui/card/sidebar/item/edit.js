import {Session} from "meteor/session";
import "./edit.html";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/cardsets";
/*
 * ############################################################################
 * cardSidebarItemEdit
 * ############################################################################
 */

Template.cardSidebarItemEdit.helpers({
	isShuffledCardset: function () {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', shuffled: true}).shuffled;
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
		}
	},
	getCardsetId: function () {
		return Router.current().params._id;
	}
});

Template.cardSidebarItemEdit.events({
	"click .editCard": function () {
		Router.go('editCard', {
			_id: Router.current().params._id,
			card_id: Session.get('activeCard')
		});
	}
});
