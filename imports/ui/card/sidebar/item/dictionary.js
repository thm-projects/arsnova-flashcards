import "./dictionary.html";
import {Session} from "meteor/session";
import {CardType} from "../../../../util/cardTypes";
import {Dictionary} from "../../../../util/dictionary";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";

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
		return Session.get('isBeolingusModalVisible');
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
		$('#cardModalBeolingusTranslation').modal('show');
		Session.set('isBeolingusModalVisible', true);
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
		return Session.get('isDeepLModalVisible');
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	}
});

Template.cardSidebarItemDictionaryDeepL.events({
	"click .showDeepLTranslation": function () {
		Dictionary.setMode(2);
		$('#cardModalDeepLTranslation').modal('show');
		Session.set('isDeepLModalVisible', true);
	}
});
