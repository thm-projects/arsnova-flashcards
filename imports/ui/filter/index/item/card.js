//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
		FlowRouter.go('editTranscript', {card_id: $(event.target).data('id')});
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
	getCardsetID: function () {
		return FlowRouter.getParam('_id');
	},
	setGridSize: function (gridSize) {
		let item = JSON.parse(JSON.stringify(this));
		item.gridSize = gridSize;
		return item;
	}
});
