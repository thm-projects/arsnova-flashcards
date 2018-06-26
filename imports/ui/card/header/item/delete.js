import {Session} from "meteor/session";
import "./delete.html";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/cardsets";

/*
 * ############################################################################
 * cardHeaderItemDelete
 * ############################################################################
 */

Template.cardHeaderItemDelete.helpers({
	isShuffledCardset: function () {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', shuffled: true}).shuffled;
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
		}
	}
});

Template.cardHeaderItemDelete.events({
	"click .deleteCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		$('.deleteCard').addClass("pressed");
		$('#deleteCardModal').modal('show');
	}
});
