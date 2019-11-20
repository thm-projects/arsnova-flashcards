import {Session} from "meteor/session";
import "./edit.html";
import {Route} from "../../../../api/route";
import {Cards} from "../../../../api/subscriptions/cards";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {CardNavigation} from "../../../../api/cardNavigation";
/*
 * ############################################################################
 * cardSidebarItemEdit
 * ############################################################################
 */

Session.setDefault('cardEditMode', undefined);

Template.cardSidebarItemEdit.helpers({
	getCardsetId: function () {
		return Router.current().params._id;
	},
	isCardNavigationVisible: function () {
		return CardNavigation.isVisible();
	}
});

Template.cardSidebarItemEdit.events({
	"click .editCard": function () {
		let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {_id: 1}});
		let activeCard = Cards.findOne({_id: Session.get('activeCard')}, {fields: {_id: 1, cardset_id: 1}});
		let cardEditMode = {};
		cardEditMode.cardset = cardset._id;
		if (Route.isBox()) {
			cardEditMode.route = "leitner";
		} else if (Route.isMemo()) {
			cardEditMode.route = "wozniak";
		} else if (Route.isPresentation()) {
			cardEditMode.route = "presentation";
		} else {
			cardEditMode.route = "cardset";
		}
		Session.set('cardEditMode', cardEditMode);
		Router.go('editCard', {
			_id: activeCard.cardset_id,
			card_id: activeCard._id
		});
	}
});
