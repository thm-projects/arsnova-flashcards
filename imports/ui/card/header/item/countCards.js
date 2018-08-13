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
	getCardsetCount: function (isPreview) {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', name: 'DemoCardset', shuffled: true}).quantity;
		} else if (Route.isMakingOf()) {
			return Cardsets.findOne({kind: 'demo', name: 'MakingOfCardset', shuffled: true}).quantity;
		}
		if (isPreview) {
			return Cards.find({cardset_id: Router.current().params._id}).count();
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).quantity;
		}
	}
});
