import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../../api/subscriptions/cards";
import {Dictionary} from "../../../util/dictionary";
import "./deeplTranslation.html";
import {Route} from "../../../util/route";
import {CardIndex} from "../../../util/cardIndex";

Session.setDefault('isDeepLModalVisible', false);
Session.setDefault('isBeolingusModalVisible', false);

/*
 * ############################################################################
 * cardModalDeepLTranslation
 * ############################################################################
 */

Template.cardModalDeepLTranslation.helpers({
	isModalVisible: function () {
		return Session.get('isDeepLModalVisible');
	}
});

Template.cardModalDeepLTranslation.onRendered(function () {
	$('#cardModalDeepLTranslation').on('shown.bs.modal', function () {
		Session.set('isDeepLModalVisible', true);
	});
	$('#cardModalDeepLTranslation').on('hidden.bs.modal', function () {
		Session.set('isDeepLModalVisible', false);
	});
});

Template.cardModalDeepLTranslation.onDestroyed(function () {
	Session.set('isDeepLModalVisible', false);
	Dictionary.setMode(-1);
});

/*
 * ############################################################################
 * cardModalDeepLTranslationContent
 * ############################################################################
 */

Template.cardModalDeepLTranslationContent.helpers({
	getDictionaryQuery: function () {
		let content;
		if (Route.isEditMode()) {
			content = CardIndex.getCards()[0];
		} else {
			content = Cards.findOne({_id: Session.get('activeCard')});
		}
		return Dictionary.getQuery(content, 2);
	}
});


Template.cardModalDeepLTranslationContent.onRendered(function () {
	Dictionary.setBlur();
});
