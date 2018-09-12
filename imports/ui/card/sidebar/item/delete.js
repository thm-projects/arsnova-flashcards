import "./delete.html";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/cardsets";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * cardSidebarItemDelete
 * ############################################################################
 */

Template.cardSidebarItemDelete.onRendered(function () {
	$('#deleteCardModal').on('hidden.bs.modal', function () {
		$('.deleteCard').removeClass("pressed");
	}).modal('hide');
});

Template.cardSidebarItemDelete.helpers({
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

Template.cardSidebarItemDelete.events({
	"click .deleteCard": function () {
		$('.deleteCard').addClass("pressed");
		$('#deleteCardModal').modal('show');
	}
});
