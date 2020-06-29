import "./answerEditor.html";
import {MarkdeepEditor} from "../../../../../api/markdeepEditor";
import {Session} from "meteor/session";

let answerDropdownResizeSensor;

/*
 * ############################################################################
 * markdeepNavigationItemAnswerEditor
 * ############################################################################
 */

Template.markdeepNavigationItemAnswerEditor.events({
	'click .markdeep-answer-add': function () {
		if (Session.get('markdeepEditorAnswers').length < 26) {
			let answers = Session.get('markdeepEditorAnswers');
			answers.push({
				answer: '',
				explanation: ''
			});
			Session.set('markdeepEditorAnswers', answers);
			Session.set('activeAnswerID', answers.length - 1);
		}
		MarkdeepEditor.focusOnContentEditor();
	},
	'click .markdeep-answer-remove': function () {
		if (Session.get('markdeepEditorAnswers').length > 0) {
			let answers = Session.get('markdeepEditorAnswers');
			answers.pop();
			Session.set('markdeepEditorAnswers', answers);
			if (Session.get('activeAnswerID') >= answers.length && answers.length !== 0) {
				Session.set('activeAnswerID', answers.length - 1);
			} else {
				Session.set('activeAnswerID', -1);
			}
			let rightAnswers = Session.get('rightAnswers');
			for (let i = 0; i < rightAnswers.length; i++) {
				if (rightAnswers[i] >= answers.length) {
					rightAnswers.splice(i, 1);
				}
			}
			rightAnswers.sort((a, b) => a - b);
			Session.set('rightAnswers', rightAnswers);
			MarkdeepEditor.focusOnContentEditor();
		}
	},
	'click .markdeep-toggle-right-answer': function () {
		let index = Session.get('rightAnswers').indexOf(Session.get('activeAnswerID'));
		let rightAnswers = Session.get('rightAnswers');
		if (index >= 0) {
			rightAnswers.splice(index, 1);
		} else {
			rightAnswers.push(Session.get('activeAnswerID'));
		}
		rightAnswers.sort((a, b) => a - b);
		Session.set('rightAnswers', rightAnswers);
		MarkdeepEditor.focusOnContentEditor();
	},
	'click .markdeep-toggle-randomized-positions': function () {
		Session.set('randomizeAnswerPositions', !Session.get('randomizeAnswerPositions'));
		MarkdeepEditor.focusOnContentEditor();
	},
	'click .markdeep-toggle-explanation': function () {
		Session.set('isExplanationEditorEnabled', !Session.get('isExplanationEditorEnabled'));
		MarkdeepEditor.focusOnContentEditor();
	}
});

Template.markdeepNavigationItemAnswerEditor.helpers({
	gotRandomizedAnswerPositions: function () {
		return Session.get('randomizeAnswerPositions');
	},
	isRightAnswer: function () {
		return Session.get('rightAnswers').indexOf(Session.get('activeAnswerID')) >= 0;
	},
	isAnswer: function () {
		return Session.get('activeAnswerID') >= 0;
	},
	disableAddAnswerButton: function () {
		return Session.get('markdeepEditorAnswers').length >= 26;
	},
	disableRemoveAnswerButton: function () {
		return Session.get('markdeepEditorAnswers').length <= 0;
	},
	isExplanationEditorEnabled: function () {
		return Session.get('isExplanationEditorEnabled');
	}
});

/*
 * ############################################################################
 * markdeepNavigationItemAnswerEditorDropdown
 * ############################################################################
 */

Template.markdeepNavigationItemAnswerEditorDropdown.onRendered(function () {
	Session.set('activeAnswerID', -1);
	answerDropdownResizeSensor = $(window).resize(function () {
		MarkdeepEditor.setAnswerDropdownSize();
	});
	MarkdeepEditor.setAnswerDropdownSize();
});

Template.markdeepNavigationItemAnswerEditorDropdown.onDestroyed(function () {
	if (answerDropdownResizeSensor !== undefined) {
		answerDropdownResizeSensor.off('resize');
	}
});


Template.markdeepNavigationItemAnswerEditorDropdown.events({
	'click .dropdown-item': function (event) {
		Session.set('activeAnswerID', $(event.currentTarget).data('id'));
	}
});

Template.markdeepNavigationItemAnswerEditorDropdown.helpers({
	getActiveAnswer: function () {
		return Session.get('activeAnswerID');
	},
	isActiveAnswer: function (index) {
		return Session.get('activeAnswerID') === index;
	},
	getAnswers: function () {
		return Session.get('markdeepEditorAnswers');
	},
	getAnswerTag: function (index) {
		return MarkdeepEditor.getAnswerTag(index);
	},
	isRightAnswer: function (index) {
		return Session.get('rightAnswers').indexOf(index) >= 0;
	},
	gotRandomizedAnswerPositions: function () {
		return Session.get('randomizeAnswerPositions');
	},
	gotExplanation: function (id) {
		let answer = Session.get('markdeepEditorAnswers')[id];
		if (answer !== undefined && answer.explanation !== undefined) {
			return answer.explanation.trim().length > 0;
		}
	}
});
