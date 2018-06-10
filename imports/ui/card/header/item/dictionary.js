import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";
import {Route} from "../../../../api/route";

/*
 * ############################################################################
 * cardHeaderItemDictionary
 * ############################################################################
 */

Template.cardHeaderItemDictionary.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview');
		}
	}
});

Template.cardHeaderItemDictionary.events({
	"click .showLecture": function () {
		if (Route.isPresentationOrDemo()) {
			MarkdeepEditor.displayDictionary();
		} else {
			let showLecture = $('.item.active .showLecture');
			if (showLecture.hasClass("pressed")) {
				showLecture.removeClass("pressed");
			} else {
				showLecture.addClass("pressed");
			}
		}
	}
});

