import './publish.html';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {CardType} from "../../../../../api/cardTypes";

Template.filterIndexItemBottomPublish.helpers({
	canPublish: function () {
		if (!CardType.gotTranscriptBonus(this.cardType)) {
			let cardCount;
			if (this.shuffled) {
				cardCount = 2;
			} else {
				cardCount = 1;
			}
			return (this.quantity >= cardCount || this.reviewed || this.request);
		}
	}
});

Template.filterIndexItemBottomPublish.events({
	'click .publishCardset': function (event) {
		Session.set('activeCardset', Cardsets.findOne($(event.target).data('id')));
	}
});
