import "./dictionary.html";
import {CardType} from "../../../../api/cardTypes";
import {Dictionary} from "../../../../api/dictionary";
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
			return Dictionary.checkMode(1);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryBeolingus.events({
	"click .showBeolingusTranslation": function () {
		Dictionary.setMode(1);
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
			return Dictionary.checkMode(2);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryLinguee.events({
	"click .showLingueeTranslation": function () {
		Dictionary.setMode(2);
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
			return Dictionary.checkMode(3);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryGoogle.events({
	"click .showGoogleTranslation": function () {
		Dictionary.setMode(3);
	}
});

/*
 * ############################################################################
 * cardHeaderItemDictionaryDeepL
 * ############################################################################
 */

Template.cardHeaderItemDictionaryDeepL.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	isDeepLActive: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Dictionary.checkMode(4);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardHeaderItemDictionaryDeepL.events({
	"click .showDeepLTranslation": function () {
		Dictionary.setMode(4);
	}
});
