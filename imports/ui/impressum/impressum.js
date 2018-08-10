//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Session} from "meteor/session";
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
	this.subscribe("cards");
});

/*
 * ############################################################################
 * contactNavigation
 * ############################################################################
 */

Template.contactNavigation.helpers({
	displayAsFooter: function () {
		return (Route.isHome() || Route.isFirstTimeVisit());
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
 * help
 * ############################################################################
 */

Template.help.onRendered(function () {
	let target = Session.get('helpTarget');
	if (target !== undefined) {
		let anchor = $(target);
		if (anchor.length) {
			$(window).scrollTop((anchor.offset().top - 70));
			Session.set('helpTarget', undefined);
		}
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
		let cardset = Cardsets.findOne({shuffled: true, kind:  "demo"});
		if (cardset !== undefined) {
			let cardCount = Cards.find({cardset_id: {$in: cardset.cardGroups}}).count();
			return cardCount === cardset.quantity;
		}
	}
});
