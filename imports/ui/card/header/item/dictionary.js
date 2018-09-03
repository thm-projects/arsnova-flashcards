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
			return Session.get('dictionaryMode') === 1;
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryBeolingus.events({
	"click .showBeolingusTranslation": function () {
		MarkdeepEditor.changeDictionaryMode(1);
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
			return Session.get('dictionaryMode') === 2;
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryLinguee.events({
	"click .showLingueeTranslation": function () {
		MarkdeepEditor.changeDictionaryMode(2);
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
			return Session.get('dictionaryMode') === 3;
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryGoogle.events({
	"click .showGoogleTranslation": function () {
		MarkdeepEditor.changeDictionaryMode(3);
	}
});
