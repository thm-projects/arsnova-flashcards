import "./countCards.html";
import {Route} from "../../../../../api/route";
import {Cards} from "../../../../../api/subscriptions/cards";
import {CardIndex} from "../../../../../api/cardIndex";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * cardContentItemCountCards
 * ############################################################################
 */

Template.cardContentItemCountCards.helpers({
	cardsIndex: function (card_id) {
		return CardIndex.getActiveCardIndex(card_id);
	},
	getCardsetCount: function (isPreview) {
		let count = 0;
		let cardset;
		if (Route.isDemo()) {
			cardset = Cardsets.findOne({kind: 'demo', name: 'DemoCardset', shuffled: true}, {fields: {quantity: 1}});
			if (cardset !== undefined) {
				count = cardset.quantity;
			}
			return count;
		} else if (Route.isMakingOf()) {
			cardset = Cardsets.findOne({kind: 'demo', name: 'MakingOfCardset', shuffled: true}, {fields: {quantity: 1}});
			if (cardset !== undefined) {
				count = cardset.quantity;
			}
			return count;
		}
		if (isPreview) {
			let cardsetPreview = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {_id: 1, cardGroups: 1}});
			if (cardsetPreview !== undefined) {
				let filterQuery = {
					$or: [
						{cardset_id: cardsetPreview._id},
						{cardset_id: {$in: cardsetPreview.cardGroups}}
					]
				};
				return Cards.find(filterQuery).count();
			}
		} else {
			cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {quantity: 1}});
			if (cardset !== undefined) {
				count = cardset.quantity;
			}
			return count;
		}
	}
});
