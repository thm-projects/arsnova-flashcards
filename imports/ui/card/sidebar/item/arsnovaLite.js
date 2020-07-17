import "./arsnovaLite.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Cards} from "../../../../api/subscriptions/cards";
import {Route} from "../../../../util/route";

Session.setDefault('fragJetztSessionID', '');

/*
 * ############################################################################
 * cardSidebarItemArsnovaLite
 * ############################################################################
 */


Template.cardSidebarItemArsnovaLite.helpers({
	gotSessionID: function () {
		let cardset;
		if (Route.isDemo()) {
			cardset = Cardsets.findOne({shuffled: true, kind: {$in: ['demo']}}, {fields: {shuffled: true, fragJetzt: true}});
		} else {
			cardset = this;
		}
		if (cardset !== undefined && cardset.shuffled && cardset.fragJetzt.overrideOnlyEmptySessions) {
			let currentCard = Cards.findOne(Session.get('activeCard'));
			if (currentCard !== undefined) {
				let currentCardset = Cardsets.findOne({_id: currentCard.cardset_id}, {fields: {fragJetzt: true}});
				if (currentCardset !== undefined) {
					if (currentCardset.fragJetzt.session !== undefined && currentCardset.fragJetzt.session.length) {
						Session.set('fragJetztSessionID', currentCardset.fragJetzt.session);
						return true;
					} else if (cardset.fragJetzt.session !== undefined && cardset.fragJetzt.session.length) {
						Session.set('fragJetztSessionID', cardset.fragJetzt.session);
						return true;
					} else {
						Session.set('fragJetztSessionID', '');
					}
				}
			}
		} else if (cardset !== undefined && cardset.fragJetzt !== undefined && cardset.fragJetzt.session !== undefined && cardset.fragJetzt.session.length) {
			Session.set('fragJetztSessionID', cardset.fragJetzt.session);
			return true;
		} else {
			Session.set('fragJetztSessionID', '');
		}
	}
});

Template.cardSidebarItemArsnovaLite.events({
	"click .showArsnovaLite": function () {
		$('#arsnovaLiteModal').modal('show');
	}
});

