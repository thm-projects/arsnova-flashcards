import "./delete.html";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Template} from "meteor/templating";
import {CardNavigation} from "../../../../api/cardNavigation";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
			return Cardsets.findOne({_id: FlowRouter.getParam('_id')}).shuffled;
		}
	},
	getCardsetId: function () {
		return FlowRouter.getParam('_id');
	},
	isCardNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});

Template.cardSidebarItemDelete.events({
	"click .deleteCard": function () {
		$('.deleteCard').addClass("pressed");
		$('#deleteCardModal').modal('show');
	}
});
