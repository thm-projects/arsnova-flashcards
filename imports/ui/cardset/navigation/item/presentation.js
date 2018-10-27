//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import {Bonus} from "../../../../api/bonus";
import "./presentation.html";

/*
 * ############################################################################
 * cardsetNavigationPresentation
 * ############################################################################
 */

Template.cardsetNavigationPresentation.helpers({
	gotPresentation: function () {
		if (this.shuffled) {
			return true;
		} else {
			return CardType.gotPresentationMode(this.cardType);
		}
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetNavigationPresentation.events({
	"click #startPresentation": function () {
		Router.go('presentation', {_id: this._id});
	}
});
