//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import "./modal/help.js";
import {CardNavigation} from "../../api/cardNavigation";
import {Cardsets} from "../../api/cardsets";
import {Cards} from "../../api/cards";

Meteor.subscribe("cardsets");
Session.set('animationPlaying', false);


/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onCreated(function () {
	Session.set('activeCard', undefined);
	CardNavigation.toggleVisibility(true);
});

Template.presentationView.onRendered(function () {
	CardNavigation.toggleVisibility(true);
});

Template.presentationView.onDestroyed(function () {
	Session.set('activeCard', undefined);
	Session.set('contrastMode', false);
});

Template.presentationView.events({
	"click #backToPresentation, click #backToPresentationFullscreen": function () {
		if (Router.current().route.getName() === "demolist") {
			Router.go('demo');
		} else if (Router.current().route.getName() === "makinglist") {
			Router.go('making');
		} else {
			Router.go('presentation', {
				_id: Router.current().params._id
			});
		}
	}
});



/*
 * ############################################################################
 * makingOfCards
 * ############################################################################
 */

Template.makingOfCards.helpers({
	gotMakingOfCardsetData: function () {
		let cardset = Cardsets.findOne({shuffled: true, kind:  "demo", name: "MakingOfCardset"});
		if (cardset !== undefined) {
			let cardCount = Cards.find({cardset_id: {$in: cardset.cardGroups}}).count();
			return cardCount === cardset.quantity;
		}
	}
});
