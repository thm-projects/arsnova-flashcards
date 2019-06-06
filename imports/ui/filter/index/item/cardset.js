//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "../../../cardset/cardset.js";
import "./cardset.html";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);

/*
 * ############################################################################
 * filterIndexItemCardset
 * ############################################################################
 */

Template.filterIndexItemCardset.events({
	'click .resultName': function (event) {
		event.preventDefault();
		Router.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	}
});

Template.filterIndexItemCardset.helpers({
	getLink: function (cardset_id) {
		return ActiveRoute.name('shuffle') ? "#" : ("/cardset/" + cardset_id);
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	},
	setGridSize: function (gridSize) {
		let item = JSON.parse(JSON.stringify(this));
		item.gridSize = gridSize;
		return item;
	}
});
