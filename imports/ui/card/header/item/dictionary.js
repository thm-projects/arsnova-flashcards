import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

/*
 * ############################################################################
 * cardHeaderItemDictionaryBeolingus
 * ############################################################################
 */

Template.cardHeaderItemDictionaryBeolingus.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isBeolingusActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryBeolingus');
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryBeolingus.events({
	"click .showBeolingusTranslation": function () {
		MarkdeepEditor.displayBeolingusDictionary();
	}
});

/*
 * ############################################################################
 * cardHeaderItemDictionaryLinguee
 * ############################################################################
 */

Template.cardHeaderItemDictionaryLinguee.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isLingueeActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryLinguee');
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryLinguee.events({
	"click .showLingueeTranslation": function () {
		MarkdeepEditor.displayLingueeDictionary();
	}
});

/*
 * ############################################################################
 * cardHeaderItemDictionaryGoogle
 * ############################################################################
 */

Template.cardHeaderItemDictionaryGoogle.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
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

Template.cardHeaderItemDictionaryGoogle.events({
	"click .showGoogleTranslation": function () {
		MarkdeepEditor.displayGoogleDictionary();
	}
});
