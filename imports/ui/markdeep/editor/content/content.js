import {Session} from "meteor/session";
import {CardType} from "../../../../api/cardTypes";
import {Template} from "meteor/templating";
import {CardVisuals} from "../../../../api/cardVisuals";
import "./content.html";
import {Route} from "../../../../api/route";
import {isNewCardset} from "../../../forms/cardsetForm";
import {Dictionary} from "../../../../api/dictionary";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

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
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
	},
	'input #contentEditor': function () {
		let content = $('#contentEditor').val();
		$('#editor').attr('data-content', content);
		if (Session.get('isAnswerEditorEnabled') && Session.get('markdeepEditorAnswers').length) {
			let answers = Session.get('markdeepEditorAnswers');
			if (Session.get('isExplanationEditorEnabled')) {
				answers[Session.get('activeAnswerID')].explanation = content;
			} else {
				answers[Session.get('activeAnswerID')].answer = content;
			}
			Session.set('markdeepEditorAnswers', answers);
		} else {
			Session.set('content' + Session.get('activeCardContentId'), content);
		}
		Dictionary.setMode(0);
	}
});

Template.markdeepContent.helpers({
	canUseTextarea: function () {
		if (Session.get('isAnswerEditorEnabled') && !Session.get('markdeepEditorAnswers').length) {
			return 'disabled';
		}
	},
	getPlaceholder: function () {
		if (Session.get('isAnswerEditorEnabled')) {
			if (Session.get('markdeepEditorAnswers').length) {
				if (Session.get('isExplanationEditorEnabled')) {
					return TAPi18n.__('card.markdeepEditor.placeholders.explanation', {tag: MarkdeepEditor.getAnswerTag(Session.get('activeAnswerID'))});
				} else {
					return TAPi18n.__('card.markdeepEditor.placeholders.answer', {tag: MarkdeepEditor.getAnswerTag(Session.get('activeAnswerID'))});
				}
			} else {
				return TAPi18n.__('card.markdeepEditor.placeholders.noAnswer');
			}
		} else {
			return CardType.getPlaceholderText(Session.get('activeCardContentId'), Session.get('cardType'), Session.get('learningGoalLevel'));
		}
	},
	getContent: function () {
		if (Session.get('isAnswerEditorEnabled') && Session.get('markdeepEditorAnswers').length) {
			if (Session.get('isExplanationEditorEnabled')) {
				return Session.get('markdeepEditorAnswers')[Session.get('activeAnswerID')].explanation;
			} else {
				return Session.get('markdeepEditorAnswers')[Session.get('activeAnswerID')].answer;
			}
		} else {
			return Session.get('content' + Session.get('activeCardContentId'));
		}
	},
	getShuffleDescription: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return FlowRouter.getRouteName() === 'shuffle' ? Session.get("ShuffleTemplate").description : "";
		}
	},
	isNew: function () {
		return Session.get('isNewCardset');
	},
	isRepetitorium: function () {
		if (isNewCardset()) {
			return Route.isRepetitorienFilterIndex();
		} else {
			if (Session.get('activeCardset') !== undefined) {
				return Session.get('activeCardset').shuffled;
			}
		}
	}
});
