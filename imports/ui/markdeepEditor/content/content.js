import {Session} from "meteor/session";
import {CardType} from "../../../api/cardTypes";
import {Template} from "meteor/templating";
import {CardVisuals} from "../../../api/cardVisuals";
import "./content.html";

/*
 * ############################################################################
 * markdeepContent
 * ############################################################################
 */

Template.markdeepContent.rendered = function () {
	CardVisuals.isTextCentered();
};

Template.markdeepContent.events({
	'click #contentEditor': function () {
		Session.set('dictionaryPreview', 0);
	},
	'input #contentEditor': function () {
		let content = $('#contentEditor').val();
		$('#editor').attr('data-content', content);
		Session.set('content' + Session.get('activeCardContentId'), content);
	}
});

Template.markdeepContent.helpers({
	getPlaceholder: function () {
		return CardType.getPlaceholderText(Session.get('activeCardContentId'), Session.get('cardType'), Session.get('learningGoalLevel'));
	},
	getContent: function () {
		return Session.get('content' + Session.get('activeCardContentId'))	;
	},
	getShuffleDescription: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").description : "";
		}
	},
	isNew: function () {
		return Session.get('isNewCardset');
	}
});
