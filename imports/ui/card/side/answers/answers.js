import "./answers.html";
import {Template} from "meteor/templating";
import {CardType} from "../../../../util/cardTypes";
import {MarkdeepEditor} from "../../../../util/markdeepEditor";
import {Route} from "../../../../util/route";
import {Session} from "meteor/session";
import {AnswerUtilities} from "../../../../util/answers";

Template.cardAnswers.helpers({
	canDisplayAnswers: function () {
		if (this.answers !== undefined && this.answers.content !== undefined && CardType.gotAnswerOptions(this.cardType)) {
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
			content.card_id = this._id;
			content.side = this.forceSide;
			answers.push(content);
			content.target = i;
		}
		if (Route.isBox() && this.answers.randomized === true) {
			answers = AnswerUtilities.randomizeAnswers(this._id, answers);
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
	},
	isAnswerSelected: function (answerId) {
		return Session.get('selectedAnswers').includes(answerId);
	},
	gotSelectedByUser: function (index) {
		let leitnerHistory = AnswerUtilities.getActiveCardHistory();
		if (leitnerHistory !== undefined && leitnerHistory.mcAnswers !== undefined && leitnerHistory.mcAnswers.user !== undefined) {
			return leitnerHistory.mcAnswers.user.includes(index);
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
	},
	'click .card-content-answer': function (event) {
		let selectedAnswers = Session.get('selectedAnswers');
		let answerId = $(event.currentTarget).data('id');
		if (selectedAnswers.includes(answerId)) {
			selectedAnswers.splice(selectedAnswers.indexOf(answerId), 1);
		} else {
			selectedAnswers.push(answerId);
		}
		Session.set('selectedAnswers', selectedAnswers);
	}
});
