import {Template} from "meteor/templating";
import {Dictionary} from "../../../api/dictionary";
import {Route} from "../../../api/route";
import {CardIndex} from "../../../api/cardIndex";
import {Cards} from "../../../api/cards";
import {Session} from "meteor/session";
import "./beolingusTranslation.html";

/*
 * ############################################################################
 * cardModalBeolingusTranslation
 * ############################################################################
 */

Template.cardModalBeolingusTranslation.helpers({
	isModalVisible: function () {
		return Session.get('isBeolingusModalVisible');
	}
});

Template.cardModalBeolingusTranslation.onRendered(function () {
	$('#cardModalBeolingusTranslation').on('shown.bs.modal', function () {
		Session.set('isBeolingusModalVisible', true);
	});
	$('#cardModalBeolingusTranslation').on('hidden.bs.modal', function () {
		Session.set('isBeolingusModalVisible', false);
	});
});

Template.cardModalBeolingusTranslation.onDestroyed(function () {
	Session.set('isBeolingusModalVisible', false);
	Dictionary.setMode(-1);
});

/*
 * ############################################################################
 * cardModalBeolingusContent
 * ############################################################################
 */

Template.cardModalBeolingusContent.helpers({
	getDictionaryQuery: function () {
		let content;
		if (Route.isEditMode()) {
			content = CardIndex.getCards()[0];
		} else {
			content = Cards.findOne({_id: Session.get('activeCard')});
		}
		return Dictionary.getQuery(content, 1);
	}
});


Template.cardModalBeolingusContent.onRendered(function () {
	Dictionary.setBlur();
});
