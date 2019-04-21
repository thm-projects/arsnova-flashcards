import {CardType} from "../../../../api/cardTypes";
import {CardEditor} from "../../../../api/cardEditor.js";
import {Session} from "meteor/session";
import "./subject.html";
import {TranscriptBonusList} from "../../../../api/transcriptBonus";

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('transcriptBonus') !== undefined  && !Session.get('isPrivateTranscript')) {
			return TranscriptBonusList.getLectureName(Session.get('transcriptBonus'), false);
		} else {
			return Session.get('subject');
		}
	},
	getSubjectPlaceholder: function () {
		return CardType.getSubjectPlaceholderText(Session.get('cardType'));
	},
	gotLearningUnit: function () {
		return CardType.gotLearningUnit(Session.get('cardType'));
	},
	gotBonusSelected: function () {
		if (CardType.gotLearningUnit(Session.get('cardType')) && !Session.get('isPrivateTranscript')) {
			return "disabled";
		} else {
			return "";
		}
	}
});

Template.subjectEditor.events({
	'click #subjectEditor': function () {
		CardEditor.setEditorButtonIndex(0);
	},
	'input #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		CardEditor.setEditorButtonIndex(0);
		if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('transcriptBonus') !== undefined  && !Session.get('isPrivateTranscript')) {
		} else {
			Session.set('subject', $('#subjectEditor').val());
		}
	}
});

Template.subjectEditor.rendered = function () {
	if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('transcriptBonus') !== undefined  && !Session.get('isPrivateTranscript')) {
	} else {
		Session.set('subject', $('#subjectEditor').val());
	}
};
