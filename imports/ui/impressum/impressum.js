//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Route} from "../../api/route.js";

/*
 * ############################################################################
 * contact
 * ############################################################################
 */


Template.contact.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});

Template.contact.events({
	'click #backButton': function () {
		window.history.back();
	}
});

Template.contact.onCreated(function () {
	this.subscribe("cardsets");
});

/*
 * ############################################################################
 * contactNavigation
 * ############################################################################
 */

Template.contactNavigation.helpers({
	displayAsFooter: function () {
		return (Route.isHome() || Route.isFirstTimeVisit() || Route.isMakingOf());
	}
});

Template.contactNavigation.events({
	'click #backToStartButton': function (event) {
		event.preventDefault();
		Route.setFirstTimeVisit();
		Router.go('home');
	}
});

/*
 * ############################################################################
 * demo
 * ############################################################################
 */

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	},
	gotDemoCardsetData: function () {
		let cardset = Cardsets.findOne({shuffled: true, kind: "demo"});
		if (cardset !== undefined) {
			let cardCount = Cards.find({cardset_id: {$in: cardset.cardGroups}}).count();
			return cardCount === cardset.quantity;
		}
	}
});
