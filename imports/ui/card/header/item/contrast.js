import "./contrast.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemContrast
 * ############################################################################
 */

Template.cardHeaderItemContrast.helpers({
	gotContrastButton: function (cardType) {
		return CardType.gotContrastButton(cardType);
	},
	isContrastMode: function () {
		return Session.get('contrastMode');
	}
});

Template.cardHeaderItemContrast.events({
	"click .contrastMode": function () {
		if (Session.get('contrastMode')) {
			Session.set('contrastMode', false);
		} else {
			Session.set('contrastMode', true);
		}
	}
});
