import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

/*
 * ############################################################################
 * cardHeaderItemDictionary
 * ############################################################################
 */

Template.cardHeaderItemDictionary.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isBeolingusActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryBeolingus');
		}
	},
	isLingueeActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryLinguee');
		}
	},
	isGoogleActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryGoogle');
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionary.events({
	"click .showBeolingusTranslation": function () {
		MarkdeepEditor.displayBeolingusDictionary();
	},
	"click .showLingueeTranslation": function () {
		MarkdeepEditor.displayLingueeDictionary();
	},
	"click .showGoogleTranslation": function () {
		MarkdeepEditor.displayGoogleDictionary();
	}
});

