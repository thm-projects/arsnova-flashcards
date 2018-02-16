//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "./card.html";
import '/client/hammer.js';

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */

function defaultData() {
	Session.set('frontText', '');
	Session.set('backText', '');
	Session.set('hintText', '');
	Session.set('lectureText', '');
	Session.set('difficultyColor', 0);
	Session.set('cardType', 2);
	Session.set('centerTextElement', [false, false, false, false]);
	Session.set('learningGoalLevel', 0);
}

function isTextCentered() {
	let centerTextElement = Session.get('centerTextElement');
	let editMode = Session.get('activeEditMode');
	if (centerTextElement !== undefined && centerTextElement[editMode]) {
		$(".center-button").addClass('pressed');
	} else {
		$(".center-button").removeClass('pressed');
	}
}

function initializeContent() {
	if (Session.get('frontText') === undefined) {
		Session.set('frontText', '');
	}

	if (Session.get('backText') === undefined) {
		Session.set('backText', '');
	}

	if (Session.get('hintText') === undefined) {
		Session.set('hintText', '');
	}

	if (Session.get('difficultyColor') === undefined) {
		Session.set('difficultyColor', 0);
	}

	if (Session.get('learningGoalLevel') === undefined) {
		Session.set('learningGoalLevel', 0);
	}

	if (Session.get('cardType') === undefined) {
		Session.set('cardType', 2);
	}

	if (Session.get('lectureText') === undefined) {
		Session.set('lectureText', '');
	}

	if ((Session.get('cardType') === 1 || Session.get('cardType') === 3) && Session.get('centerTextElement') === undefined) {
		Session.set('centerTextElement', [false, false, false, false]);
	} else if (Session.get('centerTextElement') === undefined) {
		Session.set('centerTextElement', [false, false, false, false]);
	}

	if (Session.get('cardDate') === undefined) {
		Session.set('cardDate', new Date());
	}
}

/**
 * Function checks if route is a card edit Mode
 * @return {Boolean} Return true, when route is new Card or edit Card.
 */
function isEditMode() {
	return Router.current().route.getName() === "newCard" || Router.current().route.getName() === "editCard";
}

let lastEditMode = 0;
let isEditorFullscreen = false;

function prepareFront() {
	isTextCentered();
	if (Session.get('activeEditMode') === 1) {
		$(".box").removeClass("disableCardTransition");
	}
	Session.set('activeEditMode', 0);
	if (Session.get('fullscreen') && isEditorFullscreen) {
		lastEditMode = Session.get('activeEditMode');
	}
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 6);
	$('#contentEditor').val(Session.get('frontText'));
	$('#editor').attr('data-content', Session.get('frontText'));
	$('#editFront').removeClass('btn-default').addClass('btn-primary');
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	if (Session.get('cardType') === 0) {
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
	}
}

function prepareBack() {
	isTextCentered();
	if (Session.get('activeEditMode') !== 0 && (Session.get('activeEditMode') === 2 || Session.get('activeEditMode') === 3)) {
		$(".box").addClass("disableCardTransition");
	} else if (Session.get('activeEditMode') === 0) {
		$(".box").removeClass("disableCardTransition");
	}
	Session.set('activeEditMode', 1);
	if (Session.get('fullscreen') && isEditorFullscreen) {
		lastEditMode = Session.get('activeEditMode');
	}
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 8);
	$('#contentEditor').val(Session.get('backText'));
	$('#editor').attr('data-content', Session.get('backText'));
	$('#editBack').removeClass('btn-default').addClass('btn-primary');
	$('#editFront').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	if (Session.get('cardType') === 0) {
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
	}
}

function turnFront(adjustEditWindow = false) {
	if (Session.get('reverseViewOrder')) {
		Session.set('isQuestionSide', false);
	} else {
		Session.set('isQuestionSide', true);
	}
	if (isEditMode() && adjustEditWindow) {
		prepareFront();
	}
	$(".cardfront-symbol").css('display', "");
	$(".cardback-symbol").css('display', "none");
	$(".cardfront").css('display', "");
	$(".cardFrontHeader").css('display', "");
	$(".cardback").css('display', "none");
	$(".cardBackHeader").css('display', "none");
	$(".box").removeClass("flipped");
	$(".cardHeader").removeClass("back");
	$(".cardContent").removeClass("back");
}

function turnBack(adjustEditWindow = false) {
	if (Session.get('reverseViewOrder')) {
		Session.set('isQuestionSide', true);
	} else {
		Session.set('isQuestionSide', false);
	}
	if (isEditMode() && adjustEditWindow) {
		prepareBack();
	}
	$(".cardfront-symbol").css('display', "none");
	$(".cardback-symbol").css('display', "");
	$(".cardfront").css('display', "none");
	$(".cardFrontHeader").css('display', "none");
	$(".cardback").css('display', "");
	$(".cardBackHeader").css('display', "");
	$(".box").addClass("flipped");
	$(".cardHeader").addClass("back");
	$(".cardContent").addClass("back");
}

Session.set('activeEditMode', 0);

function defaultToFront(cardType) {
	Session.set('activeEditMode', 0);
	$('#contentEditor').val(Session.get('frontText'));
	Session.set('cardType', cardType);
	$('#editFront').removeClass('btn-default').addClass('btn-primary');
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
	$('#editLecture').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	turnFront();
}

function editFront() {
	prepareFront();
	$(".clicktoflip").css('display', "");
	turnFront();
}

function editBack() {
	prepareBack();
	$(".clicktoflip").css('display', "");
	turnBack();
}

function editLecture() {
	isTextCentered();
	if (Session.get('activeEditMode') === 1) {
		$(".box").addClass("disableCardTransition");
	}
	Session.set('activeEditMode', 3);
	if (Session.get('fullscreen') && isEditorFullscreen) {
		lastEditMode = Session.get('activeEditMode');
	}
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 10);
	$('#contentEditor').val(Session.get('lectureText'));
	$('#editor').attr('data-content', Session.get('lectureText'));
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
	$('#editFront').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	if (Session.get('cardType') === 0) {
		$('#editLecture').removeClass('btn-default').addClass('btn-primary');
	}
	$(".clicktoflip").css('display', "none");
	turnFront();
	$(".cardFrontHeader").css('display', "none");
}

function editHint() {
	isTextCentered();
	if (Session.get('activeEditMode') === 1) {
		$(".box").addClass("disableCardTransition");
	}
	Session.set('activeEditMode', 2);
	if (Session.get('fullscreen') && isEditorFullscreen) {
		lastEditMode = Session.get('activeEditMode');
	}
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 12);
	$('#contentEditor').val(Session.get('hintText'));
	$('#editor').attr('data-content', Session.get('hintText'));
	$('#editHint').removeClass('btn-default').addClass('btn-primary');
	$('#editFront').removeClass('btn-primary').addClass('btn-default');
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
	if (Session.get('cardType') === 0) {
		$('#editLecture').removeClass('btn-primary').addClass('btn-default');
	}
	$(".clicktoflip").css('display', "none");
	turnFront();
	$(".cardFrontHeader").css('display', "none");
}

/**
 * Surrounds a selected text with the markdown tags for an image.
 * @param {event} e - The DOM Event
 */
export function image(e) {
	// Give ![] surround the selection and prepend the image link
	var chunk, cursor, selected = e.getSelection(), link;

	if (selected.length === 0) {
		// Give extra word
		chunk = e.__localize('enter image description here');
	} else {
		chunk = selected.text;
	}

	link = prompt(e.__localize('Insert Image Hyperlink'), 'http://');

	if (link !== null && link !== '' && link !== 'http://' && link.substr(0, 4) === 'http') {
		var sanitizedLink = $('<div>' + link + '</div>').text();

		// transform selection and set the cursor into chunked text
		e.replaceSelection('![' + chunk + '](' + sanitizedLink + ')');
		cursor = selected.start + 2;

		// Set the cursor
		e.setSelection(cursor, cursor + chunk.length);
	}
}

export function tex(e) {
	// Give/remove ** surround the selection
	var chunk, cursor, selected = e.getSelection(), content = e.getContent();

	if (selected.length === 0) {
		// Give extra word
		chunk = e.__localize('tex');
	} else {
		chunk = selected.text;
	}

	// transform selection and set the cursor into chunked text
	if (content.substr(selected.start - 2, 2) === '$$' && content.substr(selected.end, 2) === '$$') {
		e.setSelection(selected.start - 2, selected.end + 2);
		e.replaceSelection(chunk);
		cursor = selected.start - 2;
	} else {
		e.replaceSelection('$$' + chunk + '$$');
		cursor = selected.start + 2;
	}

	// Set the cursor
	e.setSelection(cursor, cursor + chunk.length);
}

/**
 * Adjust the width of the fixed answer options to fit the screen
 */
export function resizeAnswers() {
	$("#answerOptions").width($("#backButton").width() + 16);
}

let editorFullScreenActive = false;

/**
 * Resizes flashcards to din a6 format
 */
function resizeFlashcards() {
	let newFlashcardBodyHeight;
	if (editorFullScreenActive) {
		newFlashcardBodyHeight = ($(window).height() * 0.78);
		$('#contentEditor').css('min-height', newFlashcardBodyHeight);
	} else {
		$('#contentEditor').css('min-height', 'unset');
		newFlashcardBodyHeight = ($('#cardCarousel').width() / Math.sqrt(2)) - $('.cardHeader').height();
		$('.cardContent').css('min-height', newFlashcardBodyHeight);
		let newCenterTextHeight = (newFlashcardBodyHeight / 2) - 18;
		$('.center-align').css('margin-top', newCenterTextHeight);
		$('.dictionaryFrame').css('min-height', newFlashcardBodyHeight);
	}
	setTimeout(resizeFlashcards, 125);
}

/**
 * Function checks if route is a Box
 * @return {Boolean} Return true, when the current route is a Box.
 */
function isBox() {
	return Router.current().route.getName() === "box";
}

/**
 * Function checks if route is a Cardset
 * @return {Boolean} Return true, when route is a Memo.
 */
function isMemo() {
	return Router.current().route.getName() === "memo";
}

/**
 * Toggle the card view between fullscreen and normal mode
 */
export function toggleFullscreen(forceOff = false, isEditor = false) {
	isEditorFullscreen = isEditor;
	if (forceOff && (!isBox() && !isMemo())) {
		Session.set("workloadFullscreenMode", false);
	}
	if ((Session.get('fullscreen') || forceOff)) {
		Session.set('fullscreen', false);
		$("#theme-wrapper").css("margin-top", "100px");
		$("#answerOptions").css("margin-top", "0");
		$(".editorElement").css("display", '');
		$("#preview").css("display", "unset");
		$(".editorToolbar").css("display", '');
		$(".fullscreen-button").removeClass("pressed");
		editorFullScreenActive = false;
		if (lastEditMode === 2 && lastEditMode === 3) {
			$(".cardFrontHeader").css('display', "none");
			$(".cardBackHeader").css('display', "none");
			$(".clicktoflip").css('display', "none");
		}
		if (!isEditor) {
			switch (lastEditMode) {
				case 0:
					editFront();
					break;
				case 1:
					editBack();
					break;
				case 2:
					editHint();
					break;
				case 3:
					editLecture();
					break;
			}
			Session.set('activeEditMode', lastEditMode);
		}
	} else {
		Session.set('fullscreen', true);
		if (Session.get('activeEditMode') === 1) {
			$(".cardBackHeader").css('display', "");
		} else {
			$(".cardFrontHeader").css('display', "");
		}
		$(".clicktoflip").css('display', "");
		$(".box").removeClass("disableCardTransition");
		$("#theme-wrapper").css("margin-top", "20px");
		$("#answerOptions").css("margin-top", "-80px");
		$(".editorElement").css("display", "none");
		if (isEditor) {
			$("#preview").css("display", "none");
			editorFullScreenActive = true;
			$(".fullscreen-button").addClass("pressed");
		} else {
			$(".editorToolbar").css("display", "none");
			lastEditMode = Session.get('activeEditMode');
			if (Session.get('activeEditMode') === 2 || Session.get('activeEditMode') === 3) {
				Session.set('activeEditMode', 0);
			}
		}
	}
}

/**
 * Function changes from the backside to the front side of
 * a card or the other way around
 */
export function turnCard(adjustEditWindow = false) {
	if ($(".cardfront").css('display') === 'none') {
		turnFront(adjustEditWindow);
	} else if ($(".cardback").css('display') === 'none') {
		turnBack(adjustEditWindow);
	}
}

let additionalButtons = [
	[{
		name: "groupCustom",
		data: [{
			name: 'cmdPics',
			title: 'Image',
			icon: 'fa fa-file-image-o',
			callback: image
		}, {
			name: "cmdTex",
			title: "Tex",
			icon: "fa fa-superscript",
			callback: tex
		}, {
			name: 'cmdCenter',
			title: 'Center',
			icon: 'material-icons center-button',
			callback: function () {
				let centerTextElement = Session.get('centerTextElement');
				let editMode = Session.get('activeEditMode');
				if (centerTextElement[editMode]) {
					centerTextElement[editMode] = false;
					Session.set('centerTextElement', centerTextElement);
				} else {
					centerTextElement[editMode] = true;
					Session.set('centerTextElement', centerTextElement);
				}
			}
		}, {
			name: 'cmdTask',
			title: 'Task',
			icon: 'fa fa-check-square',
			callback: function (e) {
				// Prepend/Give - surround the selection
				let chunk, cursor, selected = e.getSelection();

				// transform selection and set the cursor into chunked text
				if (selected.length === 0) {
					// Give extra word
					chunk = e.__localize('list task here');

					e.replaceSelection('* [ ]  ' + chunk);
					// Set the cursor
					cursor = selected.start + 7;
				} else {
					if (selected.text.indexOf('\n') < 0) {
						chunk = selected.text;

						e.replaceSelection('* [ ]  ' + chunk);

						// Set the cursor
						cursor = selected.start + 7;
					} else {
						let list = [];

						list = selected.text.split('\n');
						chunk = list[0];

						$.each(list, function (k, v) {
							list[k] = '* [ ]  ' + v;
						});

						e.replaceSelection('\n\n' + list.join('\n'));

						// Set the cursor
						cursor = selected.start + 4;
					}
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}
		]
	}]
];

/**
 * Function checks if route is a Cardset
 * @return {Boolean} Return true, when route is a Cardset.
 */
function isCardset() {
	return Router.current().route.getName() === "cardsetdetailsid";
}


function getCardsetCards() {
	let query = "";
	if (Session.get('activeCardset').shuffled) {
		query = Cards.find({cardset_id: {$in: Session.get('activeCardset').cardGroups}}, {
			sort: {
				subject: 1,
				front: 1
			}
		});
	} else {
		query = Cards.find({cardset_id: Session.get('activeCardset')._id}, {sort: {subject: 1, front: 1}});
	}
	query.observeChanges({
		removed: function () {
			$('#cardCarousel .item:first-child').addClass('active');
		}
	});
	return query;
}

/**
 * Get a set of cards for the learning algorithm by Leitner.
 * @return {Collection} The card set
 */
function getLeitnerCards() {
	let cards = [];
	let learnedCards = Leitner.find({
		cardset_id: Session.get('activeCardset')._id,
		user_id: Meteor.userId(),
		active: true
	}, {
		sort: {
			currentDate: 1,
			skipped: -1
		}
	});
	learnedCards.forEach(function (learnedCard) {
		let card = Cards.findOne({
			_id: learnedCard.card_id
		});
		cards.push(card);
	});
	return cards;
}

/**
 * Get the Session Data of the card
 * @return {Collection} The Session Data of the card.
 */
function getEditModeCard() {
	let id = "-1";
	if (ActiveRoute.name('editCard')) {
		id = Session.get('modifiedCard');
	} else {
		Session.set('modifiedCard', undefined);
	}
	return [{
		"_id": id,
		"subject": Session.get('subjectEditorText'),
		"difficulty": Session.get('difficultyColor'),
		"learningGoalLevel": Session.get('learningGoalLevel'),
		"front": Session.get('frontText'),
		"back": Session.get('backText'),
		"hint": Session.get('hintText'),
		"cardset_id": Router.current().params._id,
		"cardGroup": 0,
		"cardType": Session.get('cardType'),
		"lecture": Session.get('lectureText'),
		"centerTextElement": Session.get('centerTextElement'),
		"date": Session.get('cardDate')
	}];
}

/**
 * Get a set of cards for the supermemo algorithm.
 * @return {Collection} The card collection
 */
function getMemoCards() {
	let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	actualDate.setHours(0, 0, 0, 0);
	let cards = [];

	let learnedCards = Wozniak.find({
		cardset_id: Router.current().params._id,
		user_id: Meteor.userId(),
		nextDate: {
			$lte: actualDate
		}
	}, {
		sort: {
			nextDate: 1,
			priority: 1
		}
	});
	learnedCards.forEach(function (learnedCard) {
		let card = Cards.findOne({
			_id: learnedCard.card_id
		});
		cards.push(card);
	});
	return cards;
}

function saveCard(card_id, returnToCardset) {
	initializeContent();
	let frontText = Session.get('frontText');
	let backText = Session.get('backText');
	let hintText = Session.get('hintText');
	let lectureText = Session.get('lectureText');
	let cardType = Session.get('cardType');
	let centerTextElement = Session.get('centerTextElement');
	let date = Session.get('cardDate');
	let learningGoalLevel = Session.get('learningGoalLevel');
	if (lectureText === undefined) {
		lectureText = '';
	}
	if ($('#subjectEditor').val() === '') {
		$('#subjectEditor').css('border', '1px solid');
		$('#subjectEditor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
	}
	if ($('#subjectEditor').val().length > 150) {
		$('#subjectEditor .form-control').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_max'), "danger", 'growl-top-left');
	}
	if (frontText === '') {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('fronttext_required'), "danger", 'growl-top-left');
	}
	if (cardType !== 2 && backText === '') {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('backtext_required'), "danger", 'growl-top-left');
	}
	if (frontText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	if (cardType !== 2 && backText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	if (hintText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	if (cardType === 0 && lectureText.length > 30000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	let editorIsNotEmpty;
	if (cardType === 2) {
		editorIsNotEmpty = frontText !== '' && $('#subjectEditor').val() !== '';
	} else {
		editorIsNotEmpty = frontText !== '' && backText !== '' && $('#subjectEditor').val() !== '';
	}
	let editorsValidLength = frontText.length <= 10000 && backText.length <= 10000 && lectureText.length <= 10000 && $('#subjectEditor').val().length <= 150 && hintText.length <= 10000;
	if (editorIsNotEmpty && editorsValidLength) {
		let subject = $('#subjectEditor').val();
		let difficulty = $('input[name=difficulty]:checked').val();
		if (ActiveRoute.name('newCard')) {
			Meteor.call("addCard", card_id, subject, hintText, frontText, backText, Number(difficulty), "0", Number(cardType), lectureText, centerTextElement, date, Number(learningGoalLevel), function (error, result) {
				if (result) {
					Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
					if (returnToCardset) {
						defaultData();
						Router.go('cardsetdetailsid', {
							_id: Router.current().params._id
						});
					} else {
						$('#contentEditor').val('');
						$('#editor').attr('data-content', '');
						Session.set('difficultyColor', 0);
						Session.set('learningGoalLevel', 0);
						Session.set('frontText', '');
						Session.set('backText', '');
						Session.set('hintText', '');
						Session.set('lectureText', '');
						if (cardType === 1 || cardType === 3 || cardType === 4) {
							Session.set('centerTextElement', [true, true, false, false]);
						} else {
							Session.set('centerTextElement', [false, false, false, false]);
						}
						window.scrollTo(0, 0);
						$('#editFront').click();
						$('#difficulty0').click();
					}
				}
			});
		} else {
			Meteor.call("updateCard", card_id, subject, hintText, frontText, backText, Number(difficulty), Number(cardType), lectureText, centerTextElement, date, Number(learningGoalLevel));
			Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
			if (returnToCardset) {
				defaultData();
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
				Session.set('difficultyColor', 0);
				Session.set('learningGoalLevel', 0);
				Session.set('frontText', '');
				Session.set('backText', '');
				Session.set('hintText', '');
				Session.set('lectureText', '');
				if (cardType === 1 || cardType === 3 || cardType === 4) {
					Session.set('centerTextElement', [true, true, false, false]);
				} else {
					Session.set('centerTextElement', [false, false, false, false]);
				}
				window.scrollTo(0, 0);
				Router.go('newCard', {
					_id: Router.current().params._id
				});
			}
		}
	}
}

Template.btnCard.helpers({
	isEditMode: function () {
		return ActiveRoute.name('editCard');
	},
	learningActive: function () {
		return Cardsets.findOne(Router.current().params._id).learningActive;
	},
	isDisabled: function () {
		return !(Cardsets.findOne(Router.current().params._id).learningActive) ? '' : 'disabled';
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		saveCard(this._id, false);
	},
	"click #cardSaveReturn": function () {
		saveCard(this._id, true);
	},
	'click #cardCancel': function () {
		defaultData();
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	},
	'click #cardDelete': function () {
		$("#cardDelete").remove();
		$("#cardDeleteConfirm").css('display', "");
		$('#cardDeleteConfirm').focus();
	},
	'click #cardDeleteConfirm': function () {
		var id = this._id;
		Session.set('modifiedCard', undefined);
		Meteor.call("deleteCard", id);
		Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});

/*
 * ############################################################################
 * editor
 * ############################################################################
 */

Template.editor.events({
	'click #editFront': function () {
		editFront();
	},
	'click #editBack': function () {
		editBack();
	},
	'click #editLecture': function () {
		editLecture();
	},
	'click #editHint': function () {
		editHint();
	},
	'focus #editFront': function () {
		editFront();
	},
	'focus #editBack': function () {
		editBack();
	},
	'focus #editLecture': function () {
		editLecture();
	},
	'focus #editHint': function () {
		editHint();
	}
});

Template.editor.helpers({
	getBackTitle: function () {
		switch (Session.get('cardType')) {
			case 2:
				return TAPi18n.__('backsideCardType2');
			case 3:
				return TAPi18n.__('backsideCardType3');
			case 4:
				return TAPi18n.__('backsideCardType4');
			default:
				return TAPi18n.__('backside');
		}
	},
	getContent: function () {
		if (Router.current().route.getName() === "newCard") {
			initializeContent();
		} else if (Router.current().route.getName() === "editCard") {
			Session.set('frontText', this.front);
			Session.set('backText', this.back);
			Session.set('hintText', this.hint);
			Session.set('cardType', this.cardType);
			Session.set('lectureText', this.lecture);
			Session.set('centerTextElement', this.centerTextElement);
			Session.set('difficultyColor', this.difficulty);
			Session.set('learningGoalLevel', this.learningGoalLevel);
		}
	},
	getFrontTitle: function () {
		switch (Session.get('cardType')) {
			case 2:
				return TAPi18n.__('cardType2');
			case 3:
				return TAPi18n.__('cardType3');
			case 4:
				return TAPi18n.__('frontsideCardType4');
			default:
				return TAPi18n.__('frontside');
		}
	},
	isCardType: function (type) {
		return Session.get('cardType') === type;
	},
	isTextCentered: function () {
		isTextCentered();
	}
});

Template.editor.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

/*
 * ############################################################################
 * contentEditor
 * ############################################################################
 */

Template.contentEditor.rendered = function () {
	$("#contentEditor").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		iconlibrary: "fa",
		onChange: function (e) {
			var content = e.getContent();
			$('#editor').attr('data-content', content);
			switch (Session.get('activeEditMode')) {
				case 0:
					Session.set('frontText', content);
					break;
				case 1:
					Session.set('backText', content);
					break;
				case 2:
					Session.set('hintText', content);
					break;
				case 3:
					Session.set('lectureText', content);
					break;
			}
		},
		additionalButtons: additionalButtons
	});
	isTextCentered();
	if (!ActiveRoute.name('editCard')) {
		Session.set('frontText', '');
	}
	$(".center-button").text('vertical_align_center');
	$(".fullscreen-button").addClass('glyphicon-fullscreen');
	$($(".fa-list-ol").parent()).after($(".fa-check-square").parent());
};

Template.contentEditor.events({
	'keyup #contentEditor': function () {
		$('#contentEditor .md-editor').css('border-color', '');
		$('#helpNewContent').html('');
	}
});


/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		return Session.get('subjectEditorText');
	}
});

Template.subjectEditor.events({
	'keyup #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		Session.set('subjectEditorText', $('#subjectEditor').val());
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subjectEditorText', $('#subjectEditor').val());
};

/*
 * ############################################################################
 * difficultyEditor
 * ############################################################################
 */

Template.difficultyEditor.helpers({
	isDifficultyChecked: function (difficulty) {
		return difficulty === Session.get('difficultyColor');
	},
	isCardType: function (type) {
		return Session.get('cardType') === type;
	}
});

Template.difficultyEditor.events({
	'click #difficultyGroup': function (event) {
		Session.set('difficultyColor', Number($(event.target).data('color')));
	}
});

/*
 * ############################################################################
 * learningGoalLevel
 * ############################################################################
 */

Template.learningGoalLevel.helpers({
	isLearningGoalLevelChecked: function (learningGoalLevel) {
		return learningGoalLevel <= Session.get('learningGoalLevel');
	},
	isLearningGoalLevel: function (learningGoalLevel) {
		return learningGoalLevel === Session.get('learningGoalLevel');
	}
});

Template.learningGoalLevel.events({
	'click #learningGoalLevelGroup': function (event) {
		Session.set('learningGoalLevel', Number($(event.target).data('lvl')));
	}
});
/*
 * ############################################################################
 * cardType
 * ############################################################################
 */

Template.cardType.helpers({
	isCardType: function (type) {
		return Session.get('cardType') === type;
	}
});

Template.cardType.events({
	"click #cardType0": function () {
		let centerTextElement = Session.get('centerTextElement');
		centerTextElement[0] = false;
		centerTextElement[1] = false;
		Session.set('centerTextElement', centerTextElement);
	},
	"click #cardType1": function () {
		let centerTextElement = Session.get('centerTextElement');
		centerTextElement[0] = true;
		centerTextElement[1] = true;
		Session.set('centerTextElement', centerTextElement);
	},
	"click #cardType2": function () {
		let centerTextElement = Session.get('centerTextElement');
		centerTextElement[0] = false;
		centerTextElement[1] = false;
		Session.set('centerTextElement', centerTextElement);
	},
	"click #cardType3": function () {
		let centerTextElement = Session.get('centerTextElement');
		centerTextElement[0] = true;
		centerTextElement[1] = true;
		Session.set('centerTextElement', centerTextElement);
	},
	"click #cardType4": function () {
		let centerTextElement = Session.get('centerTextElement');
		centerTextElement[0] = true;
		centerTextElement[1] = true;
		Session.set('centerTextElement', centerTextElement);
	}
});

Template.cardType.onRendered(function () {
	Session.set('cardType', Number($('input[name=cardType]:checked').val()));
	$(this.find('#cardType0')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType0').data('type')));
	});
	$(this.find('#cardType1')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType1').data('type')));
	});
	$(this.find('#cardType2')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType2').data('type')));
	});
	$(this.find('#cardType3')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType3').data('type')));
	});
	$(this.find('#cardType4')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType4').data('type')));
	});
});

/*
 * ############################################################################
 * cardHint
 * ############################################################################
 */

Template.cardHint.helpers({
	getSubject: function () {
		if (isEditMode()) {
			return Session.get('subjectEditorText');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		}
	},
	getHint: function () {
		if (isEditMode()) {
			return Session.get('hintText');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
	},
	isCentered: function () {
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).centerTextElement[2];
		}
	}
});

/*
 * ############################################################################
 * flashcards
 * ############################################################################
 */

Template.flashcards.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	Session.set('reverseViewOrder', false);
});

Template.flashcards.onRendered(function () {
	Session.set('activeEditMode', 0);
	resizeFlashcards();
	if (Router.current().route.getName() === "cardsetdetailsid") {
		let mc = new Hammer.Manager(document.getElementById('set-details-region'));
		mc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50}));
		mc.on("swipe", function (ev) {
			if (ev.deltaX < 0) {
				document.getElementById('rightCarouselControl').click();
			} else {
				document.getElementById('leftCarouselControl').click();
			}
		});
	}
	$(".box").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
		$(".box").removeClass("disableCardTransition");
	});
	if (Session.get("workloadFullscreenMode")) {
		toggleFullscreen();
	}
});

Template.flashcards.helpers({
	cardActive: function (index) {
		if (Session.get('modifiedCard')) {
			return Session.get('modifiedCard') === this._id;
		} else {
			return 0 === index;
		}
	},
	cardsIndex: function (index) {
		return index + 1;
	},
	isLearningActive: function () {
		return Session.get('activeCardset').learningActive;
	},
	isBox: function () {
		return isBox();
	},
	isCardset: function () {
		return isCardset();
	},
	isMemo: function () {
		return isMemo();
	},
	isEditMode: function () {
		return (isEditMode() && !Session.get('fullscreen'));
	},
	box: function () {
		return Session.get("selectedBox");
	},
	cardCountOne: function () {
		var cardset = Session.get('activeCardset');
		var count = Cards.find({
			cardset_id: cardset._id
		}).count();
		return count === 1;
	},
	getCards: function () {
		if (isBox()) {
			return getLeitnerCards();
		}
		if (isCardset()) {
			return getCardsetCards();
		}
		if (isMemo()) {
			return getMemoCards();
		}
		if (isEditMode()) {
			return getEditModeCard();
		}
	},
	countBox: function () {
		var maxIndex = Leitner.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: parseInt(Session.get('selectedBox'))
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	countLeitner: function () {
		var maxIndex = Leitner.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	getCardsetCount: function (getQuantityValue) {
		if (getQuantityValue) {
			return Cardsets.findOne({_id: Router.current().params._id}).quantity;
		} else {
			return Cards.find({cardset_id: Router.current().params._id}).count();
		}
	},
	getCardsetName: function () {
		return Cardsets.findOne({_id: this.cardset_id}).name;
	},
	getCardTypeName: function () {
		switch (this.cardType) {
			case 0:
				return TAPi18n.__('cardType0');
			case 1:
				return TAPi18n.__('cardType1');
			case 4:
				return TAPi18n.__('cardType4');
		}
	},
	getDifficultyName: function () {
		if (this.cardType === 2) {
			switch (this.difficulty) {
				case 0:
					return TAPi18n.__('difficultyNotes0');
				case 1:
					return TAPi18n.__('difficultyNotes1');
				case 2:
					return TAPi18n.__('difficultyNotes2');
				case 3:
					return TAPi18n.__('difficultyNotes3');
			}
		} else {
			switch (this.difficulty) {
				case 0:
					return TAPi18n.__('difficulty0');
				case 1:
					return TAPi18n.__('difficulty1');
				case 2:
					return TAPi18n.__('difficulty2');
				case 3:
					return TAPi18n.__('difficulty3');
			}
		}
	},
	getLearningGoalName: function () {
		switch (this.learningGoalLevel) {
			case 0:
				return TAPi18n.__('learning-goal.level1');
			case 1:
				return TAPi18n.__('learning-goal.level2');
			case 2:
				return TAPi18n.__('learning-goal.level3');
			case 3:
				return TAPi18n.__('learning-goal.level4');
			case 4:
				return TAPi18n.__('learning-goal.level5');
			case 5:
				return TAPi18n.__('learning-goal.level6');
		}
	},
	isCardType: function (type) {
		return type === this.cardType;
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	isFrontPreview: function () {
		return (Session.get('activeEditMode') === 0 && isEditMode());
	},
	isBackPreview: function () {
		return (Session.get('activeEditMode') === 1 && isEditMode());
	},
	isLecturePreview: function () {
		if (this.cardType === 0) {
			return (Session.get('activeEditMode') === 3 && isEditMode());
		} else {
			return false;
		}
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && isEditMode());
	},
	getCardDate: function () {
		return moment(this.date).format("DD.MM.YYYY");
	},
	getCardTime: function () {
		return moment(this.date).format("HH:MM");
	},
	isCentered: function (type) {
		if (isEditMode()) {
			let centerTextElement = Session.get('centerTextElement');
			return centerTextElement[type];
		} else {
			return this.centerTextElement[type];
		}
	}
});

Template.flashcards.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		if (Session.get('reverseViewOrder')) {
			turnBack();
		} else {
			turnFront();
		}
	},
	"click .box": function (evt) {
		if (Session.get('activeEditMode') !== 2 && Session.get('activeEditMode') !== 3 && ($(evt.target).data('type') !== "cardNavigation") && ($(evt.target).data('type') !== "cardImage")) {
			if (isEditMode() && !Session.get('fullscreen')) {
				turnCard(true);
			} else {
				turnCard();
			}
		}
	},
	"click #showHint": function (evt) {
		Session.set('selectedHint', $(evt.target).data('id'));
	},
	"click #showLecture": function (evt) {
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: $($(evt.target).data('target')).offset().top
			}, 1000);
		}, 500);
	},
	"click #swapOrder": function () {
		if (Session.get('reverseViewOrder')) {
			Session.set('reverseViewOrder', false);
			if (isEditMode()) {
				turnFront(true);
			} else {
				turnFront();
			}
		} else {
			Session.set('reverseViewOrder', true);
			if (isEditMode()) {
				turnBack(true);
			} else {
				turnBack();
			}
		}
	},
	"click #editCard": function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
	},
	"click #copyCard": function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
	},
	"click #toggleFullscreen": function () {
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
			toggleFullscreen();
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			toggleFullscreen();
		}
	}
});

/*
 * ############################################################################
 * flashcardsEmpty
 * ############################################################################
 */

Template.flashcardsEmpty.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return isBox();
	},
	isCardset: function () {
		return isCardset();
	}
});

Template.flashcardsEmpty.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * flashcardsEnd
 * ############################################################################
 */

Template.flashcardsEnd.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
});

Template.flashcardsEnd.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * copyCard
 * ############################################################################
 */

Template.copyCard.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId(),
			shuffled: false,
			_id: {$nin: [Router.current().params._id]}
		}, {
			fields: {name: 1},
			sort: {name: 1}
		});
	}
});

Template.copyCard.events({
	"click .copyCardset": function (evt) {
		Meteor.call("copyCard", Router.current().params._id, $(evt.target).data('id'), Session.get('modifiedCard'), function (error, result) {
			if (result) {
				$('#showCopyCardModal').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				Bert.alert(TAPi18n.__('copycardSuccess'), "success", 'growl-top-left');
			}
		});
	}
});

Meteor.startup(function () {
	$(document).on('keydown', function (event) {
		if (event.keyCode === 27) {
			toggleFullscreen(true);
		}
		if (Session.get('fullscreen')) {
			if ([37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 96, 97, 98, 99, 100, 101].indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 37:
						if ($('#leftCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						break;
					case 38:
						if (isEditMode()) {
							turnFront(true);
						} else {
							turnFront();
						}
						break;
					case 39:
						if ($('#rightCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						break;
					case 40:
						if (isEditMode()) {
							turnBack(true);
						} else {
							turnBack();
						}
						break;
					case 48:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 49:
						if (!Session.get('isQuestionSide')) {
							if (Router.current().route.getName() === "box") {
								$('#known').click();
							} else {
								$('#memoRate1').click();
							}
						}
						break;
					case 50:
						if (!Session.get('isQuestionSide')) {
							if (Router.current().route.getName() === "box") {
								$('#notknown').click();
							} else {
								$('#memoRate2').click();
							}
						}
						break;
					case 51:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 52:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 53:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
					case 96:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 97:
						if (!Session.get('isQuestionSide')) {
							if (Router.current().route.getName() === "box") {
								$('#known').click();
							} else {
								$('#memoRate1').click();
							}
						}
						break;
					case 98:
						if (!Session.get('isQuestionSide')) {
							if (Router.current().route.getName() === "box") {
								$('#notknown').click();
							} else {
								$('#memoRate2').click();
							}
						}
						break;
					case 99:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 100:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 101:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
				}
				event.preventDefault();
			}
		}
	});
});
