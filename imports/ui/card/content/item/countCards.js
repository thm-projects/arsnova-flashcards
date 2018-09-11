import "./countCards.html";
import {Route} from "../../../../api/route";
import {Cards} from "../../../../api/cards";
import {CardIndex} from "../../../../api/cardIndex";
import {Cardsets} from "../../../../api/cardsets";

/*
 * ############################################################################
 * cardContentItemCountCards
 * ############################################################################
 */

Template.cardContentItemCountCards.helpers({
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	getCardsetCount: function (isPreview) {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', name: 'DemoCardset', shuffled: true}).quantity;
		} else if (Route.isMakingOf()) {
			return Cardsets.findOne({kind: 'demo', name: 'MakingOfCardset', shuffled: true}).quantity;
		}
		if (isPreview) {
			let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {_id: 1, cardGroups: 1}});
			if (cardset !== undefined) {
				let filterQuery = {
					$or: [
						{cardset_id: cardset._id},
						{cardset_id: {$in: cardset.cardGroups}}
					]
				};
				return Cards.find(filterQuery).count();
			}
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).quantity;
		}
	}
});
