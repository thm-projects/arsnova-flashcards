import "./arsnovaLite.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Cards} from "../../../../api/subscriptions/cards";

Session.setDefault('fragJetztSessionID', '');

/*
 * ############################################################################
 * cardSidebarItemArsnovaLite
 * ############################################################################
 */


Template.cardSidebarItemArsnovaLite.helpers({
	gotSessionID: function () {
		if (this.shuffled && this.fragJetzt.overrideOnlyEmptySessions) {
			let currentCard = Cards.findOne(Session.get('activeCard'));
			if (currentCard !== undefined) {
				let currentCardset = Cardsets.findOne({_id: currentCard.cardset_id}, {fields: {fragJetzt: true}});
				if (currentCardset !== undefined) {
					if (this.fragJetzt.session !== undefined) {
						Session.set('fragJetztSessionID', currentCardset.fragJetzt.session);
						return true;
					} else if (currentCardset.fragJetzt.session !== undefined) {
						Session.set('fragJetztSessionID', this.fragJetzt.session);
						return true;
					} else {
						Session.set('fragJetztSessionID', '');
					}
				}
			}
		} else if (this.fragJetzt.session !== undefined) {
			Session.set('fragJetztSessionID', this.fragJetzt.session);
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

