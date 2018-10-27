//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Bonus} from "../../../../api/bonus";
import "../modal/import.js";
import "./import.html";

/*
 * ############################################################################
 * cardsetNavigationImport
 * ############################################################################
 */

Template.cardsetNavigationImport.helpers({
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetNavigationImport.events({
	'click #importCardsBtn': function () {
		Session.set('importType', 1);
	}
});
