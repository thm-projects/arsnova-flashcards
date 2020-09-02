import "./answers.html";
import {Template} from "meteor/templating";
import {CardType} from "../../../../util/cardTypes";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {Route} from "../../../../util/route";
import {Session} from "meteor/session";

Template.cardAnswers.helpers({
	canDisplayAnswers: function () {
		if (this.answers !== undefined && CardType.gotAnswerOptions(this.cardType)) {
			let gotAnswerContent = false;
			for (let i = 0; i < this.answers.content.length; i++) {
				let answer = this.answers.content[i].answer;
				if (answer !== undefined && answer.trim().length) {
					gotAnswerContent = true;
					break;
				}
			}
			if (Route.isEditMode() || Route.isPresentation()) {
				return (this.answers.enabled && gotAnswerContent) || Session.get('isAnswerEditorEnabled');
			} else {
				return this.answers.enabled && gotAnswerContent;
			}
		}
	},
	isAnswerSide: function () {
		return this.isAnswerSide;
	},
	gotExplanation: function () {
		return this.explanation.trim().length > 0;
	},
	getAnswerTag: function (index) {
		return MarkdeepEditor.getAnswerTag(index, false);
	},
	getAnswers: function () {
		let answers = [];
		let isAnswerSide = CardType.isSideWithAnswers(this, false);
		for (let i = 0; i < this.answers.content.length; i++) {
			let content = this.answers.content[i];
			if (this.answers.rightAnswers.indexOf(i) >= 0) {
				content.type = 1;
			} else {
				content.type = 0;
			}
			content.isAnswerSide = isAnswerSide;
			content._id = this._id;
			content.side = this.forceSide;
			answers.push(content);
		}
		return answers;
	},
	isRightAnswer: function () {
		if (this.type === 1) {
			return true;
		}
	},
	getAnswerTypeBackground: function () {
		if (this.isAnswerSide) {
			if (this.type === 1) {
				return 'right';
			} else {
				return 'wrong';
			}
		}
	}
});

Template.cardAnswers.events({
	'click .toggle-answer-explanation': function (event) {
		if (!Route.isEditMode()) {
			let target = $(event.currentTarget).data('target');
			$('.card-content-answer-explanation-container').not(target).slideUp();
			$(target).slideToggle();
		}
	}
});
