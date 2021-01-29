import "./arsnovaClick.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Cards} from "../../../../api/subscriptions/cards";
import {Route} from "../../../../util/route";

Session.setDefault('arsnovaClickSessionID', '');
/*
 * ############################################################################
 * cardSidebarItemArsnovaClick
 * ############################################################################
 */

Template.cardSidebarItemArsnovaClick.helpers({
	gotSessionID: function () {
		let cardset;
		if (Route.isDemo()) {
			cardset = Cardsets.findOne({shuffled: true, kind: {$in: ['demo']}}, {fields: {shuffled: true, arsnovaClick: true}});
		} else if (Route.isBox() || Route.isMemo()) {
			cardset = this.cardset;
		} else {
			cardset = this;
		}
		if (cardset.shuffled && cardset.arsnovaClick.overrideOnlyEmptySessions) {
			let currentCard = Cards.findOne(Session.get('activeCard'));
			if (currentCard !== undefined) {
				let currentCardset = Cardsets.findOne({_id: currentCard.cardset_id}, {fields: {arsnovaClick: true}});
				if (currentCardset !== undefined) {
					if (currentCardset.arsnovaClick.session !== undefined && currentCardset.arsnovaClick.session.length) {
						Session.set('arsnovaClickSessionID', currentCardset.arsnovaClick.session);
						return true;
					} else if (cardset.arsnovaClick.session !== undefined && cardset.arsnovaClick.session.length) {
						Session.set('arsnovaClickSessionID', cardset.arsnovaClick.session);
						return true;
					} else {
						Session.set('arsnovaClickSessionID', '');
					}
				}
			}
		} else if (cardset.arsnovaClick !== undefined && cardset.arsnovaClick.session !== undefined && cardset.arsnovaClick.session.length) {
			Session.set('arsnovaClickSessionID', cardset.arsnovaClick.session);
			return true;
		} else {
			Session.set('arsnovaClickSessionID', '');
		}
	}
});

Template.cardSidebarItemArsnovaClick.events({
	"click .showArsnovaClick": function () {
		$('#arsnovaClickModal').modal('show');
	}
});
