import "./headerItemCountCards.html";
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
			let cardset;
			if (Route.isDemo()) {
				cardset = Cardsets.findOne({kind: 'demo', shuffled: true});
			} else {
				cardset = Cardsets.findOne(Router.current().params._id);
			}
			if (cardset.shuffled) {
				let quantity = 0;
				cardset.cardGroups.forEach(function (cardset_id) {
					if (cardset_id !== Router.current().params._id) {
						quantity += Cardsets.findOne(cardset_id).quantity;
					}
				});
				return quantity;
			} else {
				return cardset.quantity;
			}
		} else {
			if (Route.isDemo()) {
				return Cardsets.findOne({kind: 'demo', shuffled: true}).count();
			} else {
				return Cards.find({cardset_id: Router.current().params._id}).count();
			}
		}
	}
});
