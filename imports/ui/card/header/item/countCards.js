import "./countCards.html";
import {Route} from "../../../../api/route";
import {Cards} from "../../../../api/cards";
import {CardIndex} from "../../../../api/cardIndex";
import {Cardsets} from "../../../../api/cardsets";

/*
 * ############################################################################
 * cardHeaderItemCountCards
 * ############################################################################
 */

Template.cardHeaderItemCountCards.helpers({
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	getCardsetCount: function (getQuantityValue) {
		if (getQuantityValue) {
			if (Route.isDemo()) {
				return Cards.findOne({kind: 'demo', shuffled: true}).count();
			} else {
				return Cards.find({cardset_id: Router.current().params._id}).count();
			}
		} else {
			if (Route.isDemo()) {
				return Cardsets.findOne({kind: 'demo', shuffled: true}).quantity;
			} else {
				return Cardsets.findOne({_id: Router.current().params._id}).quantity;
			}
		}
	}
});
