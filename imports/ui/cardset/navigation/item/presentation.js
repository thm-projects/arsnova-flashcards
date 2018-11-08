//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
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
	}
});

Template.cardsetNavigationPresentation.events({
	"click #startPresentation": function () {
		Router.go('presentation', {_id: this._id});
	}
});
