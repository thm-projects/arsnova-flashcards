//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "../../../cardset/cardset.js";
import "./card.html";

/*
 * ############################################################################
 * filterIndexItemCard
 * ############################################################################
 */

Template.filterIndexItemCard.events({
	'click .deleteCard': function (event) {
		Session.set('activeCard', $(event.target).data('id'));
	},
	'click .editCard': function (event) {
		Router.go('editTranscript', {card_id: $(event.target).data('id')});
	}
});

Template.filterIndexItemCard.helpers({
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	},
	firstItem: function (index) {
		return index === 0;
	}
});
