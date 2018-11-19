import {CardType} from "../../../../api/cardTypes";
import {CardEditor} from "../../../../api/cardEditor.js";
import {Cards} from "../../../../api/cards.js";
import {Session} from "meteor/session";
import "./subject.html";

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('learningUnit') !== "0") {
			let card = Cards.findOne({_id: Session.get('learningUnit')});
			if (card !== undefined && card.subject !== undefined) {
				return card.subject;
			} else {
				return "";
			}
		}
		return Session.get('subject');
	},
	getSubjectPlaceholder: function () {
		return CardType.getSubjectPlaceholderText(Session.get('cardType'));
	},
	gotLearningUnit: function () {
		return CardType.gotLearningUnit(this.cardType);
	}
});

Template.subjectEditor.events({
	'click #subjectEditor': function () {
		CardEditor.setEditorButtonIndex(0);
	},
	'input #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		CardEditor.setEditorButtonIndex(0);
		Session.set('subject', $('#subjectEditor').val());
	},
	'click .subjectEditorButton': function () {
		Session.set('tempLearningIndex', Session.get('learningIndex'));
		Session.set('tempLearningUnit', Session.get('learningUnit'));
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subject', $('#subjectEditor').val());
};
