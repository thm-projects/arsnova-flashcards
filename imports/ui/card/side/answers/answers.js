import "./answers.html";
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import {MarkdeepEditor} from "../../../../api/markdeepEditor";

Template.cardAnswers.helpers({
	gotAnswers: function () {
		let gotAnswerSupport = CardType.gotAnswerOptions(this.cardType);
		if (gotAnswerSupport && this.answers !== undefined && this.answers.content != undefined && this.answers.content.length) {
			return true;
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
		if (this.type === 1) {
			return 'right';
		} else {
			return 'wrong';
		}
	}
});
