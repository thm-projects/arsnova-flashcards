import "./answerEditor.html";
import {MarkdeepEditor} from "../../../../../api/markdeepEditor";
import {Session} from "meteor/session";
import {ServerStyle} from "../../../../../api/styles";

let answers = [];
let rightAnswers = [];
Session.set('markdeepEditorAnswers', answers);
Session.set('activeAnswerID', 0);
Session.set('rightAnswers', rightAnswers);
Session.set('randomizeAnswerPositions', false);

let answerDropdownResizeSensor;

/*
 * ############################################################################
 * markdeepNavigationItemAnswerEditor
 * ############################################################################
 */

Template.markdeepNavigationItemAnswerEditor.events({
	'click .markdeep-answer-add': function () {
		if (Session.get('markdeepEditorAnswers').length < 26) {
			answers.push({
				content: '',
				type: 0
			});
			Session.set('markdeepEditorAnswers', answers);
		}
	},
	'click .markdeep-answer-remove': function () {
		if (Session.get('markdeepEditorAnswers').length > 0) {
			answers.pop();
			Session.set('markdeepEditorAnswers', answers);
			if (Session.get('activeAnswerID') >= Session.get('markdeepEditorAnswers').length) {
				Session.set('activeAnswerID', 0);
			}
			for (let i = 0; i < rightAnswers.length; i++) {
				if (rightAnswers[i] >= answers.length) {
					rightAnswers.splice(i, 1);
				}
			}
			rightAnswers.sort((a, b) => a - b);
			Session.set('rightAnswers', rightAnswers);
		}
	},
	'click .markdeep-toggle-right-answer': function () {
		let index = Session.get('rightAnswers').indexOf(Session.get('activeAnswerID'));
		if (index >= 0) {
			rightAnswers.splice(index, 1);
		} else {
			rightAnswers.push(Session.get('activeAnswerID'));
		}
		rightAnswers.sort((a, b) => a - b);
		Session.set('rightAnswers', rightAnswers);
	},
	'click .markdeep-toggle-randomized-positions': function () {
		Session.set('randomizeAnswerPositions', !Session.get('randomizeAnswerPositions'));
	}
});

Template.markdeepNavigationItemAnswerEditor.helpers({
	gotRandomizedAnswerPositions: function () {
		return Session.get('randomizeAnswerPositions');
	},
	isRightAnswer: function () {
		return Session.get('rightAnswers').indexOf(Session.get('activeAnswerID')) >= 0;
	},
	gotAnswers: function () {
		return Session.get('markdeepEditorAnswers').length;
	},
	disableAddAnswerButton: function () {
		return Session.get('markdeepEditorAnswers').length >= 26;
	},
	disableRemoveAnswerButton: function () {
		return Session.get('markdeepEditorAnswers').length <= 0;
	}
});

/*
 * ############################################################################
 * markdeepNavigationItemAnswerEditorDropdown
 * ############################################################################
 */

Template.markdeepNavigationItemAnswerEditorDropdown.onRendered(function () {
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
		index += 10;
		return TAPi18n.__('card.markdeepEditor.answerTag', {tag: index.toString(36).toUpperCase()}, ServerStyle.getServerLanguage());
	},
	isRightAnswer: function (index) {
		return Session.get('rightAnswers').indexOf(index) >= 0;
	},
	gotRandomizedAnswerPositions: function () {
		return Session.get('randomizeAnswerPositions');
	}
});
