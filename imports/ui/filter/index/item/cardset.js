//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardset.html";
import {MainNavigation} from "../../../../api/mainNavigation";
import {LoginTasks} from "../../../../api/login";
import {Route} from "../../../../api/route";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
		FlowRouter.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	}
});

Template.filterIndexItemCardset.helpers({
	getLink: function (cardset_id) {
		return FlowRouter.getRouteName() === 'shuffle' ? "#" : ("/cardset/" + cardset_id);
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

Template.filterIndexItemCardset.onDestroyed(function () {
	if (Route.isWorkload()) {
		if (!MainNavigation.canUseWorkload()) {
			Session.set('helpFilter', undefined);
			LoginTasks.setLoginRedirect();
		}
	}
});
