import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardIndex} from "../../../../api/cardIndex";
import "./deeplTranslation.html";
import {Dictionary} from "../../../../api/dictionary";

Session.setDefault('isDeepLModalVisible', false);
/*
 * ############################################################################
 * cardEditorModalDeepLTranslation
 * ############################################################################
 */

Template.cardEditorModalDeepLTranslation.helpers({
	isModalVisible: function () {
		return Session.get('isDeepLModalVisible');
	},
	getCards: function () {
		return CardIndex.getCards();
	}
});

Template.cardEditorModalDeepLTranslation.onRendered(function () {
	$('#cardEditorModalDeepLTranslation').on('shown.bs.modal', function () {
		Session.set('isDeepLModalVisible', true);
	});
	$('#cardEditorModalDeepLTranslation').on('hidden.bs.modal', function () {
		Session.set('isDeepLModalVisible', false);
	});
});

Template.cardEditorModalDeepLTranslation.onDestroyed(function () {
	Session.set('isDeepLModalVisible', false);
	Dictionary.setMode(-1);
});
