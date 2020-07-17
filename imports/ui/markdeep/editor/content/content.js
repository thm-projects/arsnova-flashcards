import {Session} from "meteor/session";
import {CardType} from "../../../../util/cardTypes";
import {Template} from "meteor/templating";
import {CardVisuals} from "../../../../util/cardVisuals";
import "./content.html";
import {Route} from "../../../../util/route";
import {isNewCardset} from "../../../forms/cardsetForm";
import {Dictionary} from "../../../../util/dictionary";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {ServerStyle} from "../../../../util/styles";

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
		if (Session.get('isAnswerEditorEnabled')) {
			let answers = Session.get('markdeepEditorAnswers');
			if (Session.get('isExplanationEditorEnabled')) {
				answers[Session.get('activeAnswerID')].explanation = content;
				Session.set('markdeepEditorAnswers', answers);
			} else if (Session.get('activeAnswerID') < 0) {
				Session.set('cardAnswersQuestion', content);
			} else {
				answers[Session.get('activeAnswerID')].answer = content;
				Session.set('markdeepEditorAnswers', answers);
			}
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
			if (Session.get('activeAnswerID') >= 0) {
				if (Session.get('isExplanationEditorEnabled')) {
					return TAPi18n.__('card.markdeepEditor.placeholders.explanation', {tag: MarkdeepEditor.getAnswerTag(Session.get('activeAnswerID'))});
				} else {
					return TAPi18n.__('card.markdeepEditor.placeholders.answer', {tag: MarkdeepEditor.getAnswerTag(Session.get('activeAnswerID'))});
				}
			} else {
				return TAPi18n.__('card.markdeepEditor.placeholders.question');
			}
		} else {
			return CardType.getPlaceholderText(Session.get('activeCardContentId'), Session.get('cardType'), Session.get('learningGoalLevel'));
		}
	},
	getContent: function () {
		if (Session.get('isAnswerEditorEnabled')) {
			if (Session.get('activeAnswerID') < 0) {
				return Session.get('cardAnswersQuestion');
			} else {
				let content = Session.get('markdeepEditorAnswers')[Session.get('activeAnswerID')];
				if (content !== undefined) {
					if (Session.get('isExplanationEditorEnabled')) {
						return content.explanation;
					} else {
						return content.answer;
					}
				}
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
			if (ServerStyle.gotSimplifiedNav() && Route.isMyCardsets() && Session.get('useRepForm')) {
				return true;
			} else {
				return Route.isRepetitorienFilterIndex();
			}
		} else {
			if (Session.get('activeCardset') !== undefined) {
				return Session.get('activeCardset').shuffled;
			}
		}
	}
});
