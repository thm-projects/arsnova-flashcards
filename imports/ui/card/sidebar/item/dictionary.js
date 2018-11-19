import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";
import {Dictionary} from "../../../../api/dictionary";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

/*
 * ############################################################################
 * cardSidebarItemDictionaryBeolingus
 * ############################################################################
 */

Template.cardSidebarItemDictionaryBeolingus.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	},
	isBeolingusActive: function () {
		if (CardType.gotDictionary(Session.get('cardType'))) {
			return Dictionary.checkMode(1);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	},
	gotRequiredWordCount: function () {
		if (Dictionary.getWordCount() === 1) {
			return true;
		} else {
			if (Dictionary.checkMode(1)) {
				Dictionary.setMode(0);
			}
		}
	}
});

Template.cardSidebarItemDictionaryBeolingus.events({
	"click .showBeolingusTranslation": function () {
		Dictionary.setMode(1);
	}
});

/*
 * ############################################################################
 * cardSidebarItemDictionaryLinguee
 * ############################################################################
 */

Template.cardSidebarItemDictionaryLinguee.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	},
	isLingueeActive: function () {
		if (CardType.gotDictionary(Session.get('cardType'))) {
			return Dictionary.checkMode(2);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	},
	gotRequiredWordCount: function () {
		if (Dictionary.getWordCount() === 1) {
			return true;
		} else {
			if (Dictionary.checkMode(2)) {
				Dictionary.setMode(0);
			}
		}
	}
});

Template.cardSidebarItemDictionaryLinguee.events({
	"click .showLingueeTranslation": function () {
		Dictionary.setMode(2);
	}
});

/*
 * ############################################################################
 * cardSidebarItemDictionaryGoogle
 * ############################################################################
 */

Template.cardSidebarItemDictionaryGoogle.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	},
	isGoogleActive: function () {
		if (CardType.gotDictionary(Session.get('cardType'))) {
			return Dictionary.checkMode(3);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	},
	gotRequiredWordCount: function () {
		if (Dictionary.getWordCount() > 1) {
			return true;
		} else {
			if (Dictionary.checkMode(3)) {
				Dictionary.setMode(0);
			}
		}
	}
});

Template.cardSidebarItemDictionaryGoogle.events({
	"click .showGoogleTranslation": function () {
		Dictionary.setMode(3);
	}
});

/*
 * ############################################################################
 * cardSidebarItemDictionaryDeepL
 * ############################################################################
 */

Template.cardSidebarItemDictionaryDeepL.helpers({
	gotDictionary: function () {
		return CardType.gotDictionary(Session.get('cardType'));
	},
	isDeepLActive: function () {
		if (CardType.gotDictionary(Session.get('cardType'))) {
			return Dictionary.checkMode(4);
		}
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	},
	gotRequiredWordCount: function () {
		if (Dictionary.getWordCount() > 1) {
			return true;
		} else {
			if (Dictionary.checkMode(4)) {
				Dictionary.setMode(0);
			}
		}
	}
});

Template.cardSidebarItemDictionaryDeepL.events({
	"click .showDeepLTranslation": function () {
		Dictionary.setMode(4);
	}
});
