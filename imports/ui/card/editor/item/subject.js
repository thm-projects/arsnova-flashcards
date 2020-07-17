import {CardType} from "../../../../util/cardTypes";
import {CardEditor} from "../../../../util/cardEditor.js";
import {Session} from "meteor/session";
import {TranscriptBonusList} from "../../../../util/transcriptBonus";
import "./subject.html";

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('transcriptBonus') !== undefined  && !Session.get('isPrivateTranscript')) {
			return TranscriptBonusList.getLectureName(Session.get('transcriptBonus'));
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
		if (CardType.gotLearningUnit(Session.get('cardType')) && !Session.get('isPrivateTranscript') && Session.get('transcriptBonus') !== undefined) {
			return "disabled";
		} else {
			return "";
		}
	},
	gotTranscriptBonusThatExpired: function () {
		if (Session.get('transcriptBonus') !== undefined && TranscriptBonusList.isDeadlineExpired(Session.get('transcriptBonus'))) {
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
