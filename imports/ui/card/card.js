//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "./card.html";
import '/client/hammer.js';
import {skipAnswer} from "../learn/learn.js";

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */

function defaultData() {
	Session.set('subjectText', '');
	Session.set('frontText', '');
	Session.set('backText', '');
	Session.set('hintText', '');
	Session.set('lectureText', '');
	Session.set('difficultyColor', 0);
	Session.set('cardType', 2);
	Session.set('centerTextElement', [false, false, false, false]);
	Session.set('learningGoalLevel', 0);
	Session.set('backgroundStyle', 0);
	Session.get('learningUnit', '');
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
	if (Session.get('subjectText') === undefined) {
		Session.set('subjectText', '');
	}
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
		Session.set('difficultyColor', 1);
	}

	if (Session.get('learningGoalLevel') === undefined) {
		Session.set('learningGoalLevel', 0);
	}

	if (Session.get('backgroundStyle') === undefined) {
		Session.set('backgroundStyle', 0);
	}

	if (Session.get('cardType') === undefined) {
		Session.set('cardType', 2);
	}

	if (Session.get('lectureText') === undefined) {
		Session.set('lectureText', '');
	}

	if (Session.get('learningUnit') === undefined) {
		Session.set('learningUnit', '');
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

function isCardType(cardType1, cardType2, cardType3, cardType4, activeCardType) {
	let cardTypeArray = [cardType1, cardType2, cardType3, cardType4];
	if (isEditMode()) {
		return cardTypeArray.includes(Session.get('cardType'));
	} else {
		return cardTypeArray.includes(activeCardType);
	}
}

let lastEditMode = 0;
let isEditorFullscreen = false;

function setPlaceholderText(activeMode = -1, cardType = -1) {
	let placeholderText = "";
	if (activeMode < 0) {
		activeMode = Session.get('activeEditMode');
	}
	if (cardType < 0) {
		cardType = Session.get('cardType');
	}
	switch (activeMode) {
		case 0:
			switch (cardType) {
				case 0:
					placeholderText = TAPi18n.__('card.cardType0.placeholders.front');
					break;
				case 1:
					placeholderText = TAPi18n.__('card.cardType1.placeholders.front');
					break;
				case 2:
					placeholderText = TAPi18n.__('card.cardType2.placeholders.front');
					break;
				case 3:
					placeholderText = TAPi18n.__('card.cardType3.placeholders.front');
					break;
				case 4:
					placeholderText = TAPi18n.__('card.cardType4.placeholders.front');
					break;
				case 5:
					placeholderText = TAPi18n.__('card.cardType5.placeholders.front');
					break;
			}
			break;
		case 1:
			switch (cardType) {
				case 0:
					placeholderText = TAPi18n.__('card.cardType0.placeholders.back');
					break;
				case 1:
					placeholderText = TAPi18n.__('card.cardType1.placeholders.back');
					break;
				case 2:
					placeholderText = TAPi18n.__('card.cardType2.placeholders.back');
					break;
				case 3:
					placeholderText = TAPi18n.__('card.cardType3.placeholders.back');
					break;
				case 4:
					placeholderText = TAPi18n.__('card.cardType4.placeholders.back');
					break;
				case 5:
					placeholderText = TAPi18n.__('card.cardType5.placeholders.back');
					break;
			}
			break;
		case 2:
			switch (cardType) {
				case 0:
					placeholderText = TAPi18n.__('card.cardType0.placeholders.hint');
					break;
				case 2:
					placeholderText = TAPi18n.__('card.cardType2.placeholders.hint');
					break;
				case 4:
					placeholderText = TAPi18n.__('card.cardType4.placeholders.hint');
					break;
				case 5:
					placeholderText = TAPi18n.__('card.cardType5.placeholders.hint');
					break;
			}
			break;
		case 3:
			switch (cardType) {
				case 0:
					placeholderText = TAPi18n.__('card.cardType0.placeholders.lecture');
					break;
			}
			break;
	}
	return placeholderText;
}

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
	$(".cardfrontCheck").css('display', "");
	$(".cardbackCheck").css('display', "none");
	$(".box .cardfront-symbol").css('display', "");
	$(".box .cardback-symbol").css('display', "none");
	$(".box .cardfront").css('display', "");
	$(".box .cardFrontHeader").css('display', "");
	$(".box .cardback").css('display', "none");
	$(".box .cardBackHeader").css('display', "none");
	$(".box").removeClass("flipped");
	$(".box .cardHeader").removeClass("back");
	$(".box .cardContent").removeClass("back");
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
	$(".cardbackCheck").css('display', "");
	$(".cardfrontCheck").css('display', "none");
	$(".box .cardfront-symbol").css('display', "none");
	$(".box .cardback-symbol").css('display', "");
	$(".box .cardfront").css('display', "none");
	$(".box .cardFrontHeader").css('display', "none");
	$(".box .cardback").css('display', "");
	$(".box .cardBackHeader").css('display', "");
	$(".box").addClass("flipped");
	$(".box .cardHeader").addClass("back");
	$(".box .cardContent").addClass("back");
}

Session.set('activeEditMode', 0);

function editFront() {
	prepareFront();
	$(".clicktoflip").css('display', "");
	turnFront();
}

function defaultToFront(cardType) {
	if (Session.get('cardType') === 2 && cardType !== 2 && Session.get('difficultyColor') === 0) {
		Session.set('difficultyColor', 1);
	} else if (Session.get('cardType') !== 2 && cardType === 2 && Session.get('difficultyColor') === 1) {
		Session.set('difficultyColor', 0);
	}
	Session.set('cardType', cardType);
	setTimeout(function () {
		editFront();
	}, 125);
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
		chunk = e.__localize('\\int_{\\mathbb{R}^2} e^{-|x|^2} \\mathrm{d}x = \\pi');
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
 * Move the action buttons before or after the preview window
 */
function moveEditorButtonGroup() {
	if ($(window).width() >= 1200) {
		$('.editorButtonGroup').insertAfter("#preview");
	} else {
		$('.editorButtonGroup').insertBefore("#preview");
	}
}

/**
 * Resizes flashcards to din a6 format
 */
function resizeFlashcards() {
	let newFlashcardBodyHeight;
	if (editorFullScreenActive) {
		newFlashcardBodyHeight = ($(window).height() * 0.78);
		$('#contentEditor').css('height', newFlashcardBodyHeight);
	} else {
		$('#contentEditor').css('height', 'unset');
		let header = $('.cardHeader').height();
		let editorHeader = $('.btn-toolbar').height();
		if (Session.get('activeEditMode') >= 2) {
			header = 0;
			editorHeader += 20;
		}
		editorHeader -= 17;
		newFlashcardBodyHeight = ($('#cardCarousel').width() / Math.sqrt(2)) - header;
		$('.cardContent').css('height', newFlashcardBodyHeight);
		if ($(window).width() >= 1200) {
			let newEditorBodyHeight = ($('#cardCarousel').width() / Math.sqrt(2)) - editorHeader;
			$('#contentEditor').css('height', (newEditorBodyHeight));
		}
		let contentHeight = $('.center-align').height();
		let contentPadding = parseInt($('.cardContent').css('padding-top')) + parseInt($('.cardContent').css('padding-bottom'));
		let newCenterTextHeight = (((newFlashcardBodyHeight - contentPadding) - contentHeight) / 2);
		$('.center-align').css('margin-top', newCenterTextHeight);
		$('.dictionaryFrame').css('height', newFlashcardBodyHeight);
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
		$("#theme-wrapper").css("margin-top", "70px");
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
		$("#answerOptions").css("margin-top", "-50px");
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
	if ($(".cardfrontCheck").css('display') === 'none') {
		turnFront(adjustEditWindow);
	} else if ($(".cardbackCheck").css('display') === 'none') {
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
			name: 'cmdBackgroundStyle',
			title: 'Background Style',
			icon: 'fa fa-paint-brush',
			callback: function () {
				if (Session.get('backgroundStyle') === 1) {
					Session.set('backgroundStyle', 0);
				} else {
					Session.set('backgroundStyle', 1);
				}
			}
		}, {
			name: 'cmdFullscreen',
			title: 'Fullscreen',
			icon: 'glyphicon fullscreen-button',
			callback: function () {
				toggleFullscreen(false, true);
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
		"subject": Session.get('subjectText'),
		"difficulty": Session.get('difficultyColor'),
		"learningGoalLevel": Session.get('learningGoalLevel'),
		"backgroundStyle": Session.get('backgroundStyle'),
		"front": Session.get('frontText'),
		"back": Session.get('backText'),
		"hint": Session.get('hintText'),
		"cardset_id": Router.current().params._id,
		"cardGroup": 0,
		"cardType": Session.get('cardType'),
		"lecture": Session.get('lectureText'),
		"centerTextElement": Session.get('centerTextElement'),
		"date": Session.get('cardDate'),
		"learningUnit": Session.get('learningUnit')
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
	let backgroundStyle = Session.get('backgroundStyle');
	let learningUnit = Session.get('learningUnit');
	let subjectText = Session.get('subjectText');
	let gotSubject = true;
	if (cardType !== 2 || cardType !== 3 || cardType !== 5) {
		if (subjectText === "") {
			$('#subjectEditor').css('border', '1px solid');
			$('#subjectEditor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
			gotSubject = false;
		}
	} else {
		if (subjectText === "" && learningUnit === "") {
			$('#subjectEditor').css('border', '1px solid');
			$('#subjectEditor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
			gotSubject = false;
		}
	}
	if ($('#subjectEditor').val().length > 150) {
		$('#subjectEditor .form-control').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_max'), "danger", 'growl-top-left');
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
	let editorsValidLength = (frontText.length <= 10000 && backText.length <= 10000 && lectureText.length <= 30000 && $('#subjectEditor').val().length <= 150 && hintText.length <= 10000);
	if (gotSubject && editorsValidLength) {
		let difficulty = 1;
		if (Number(cardType) !== 4) {
			difficulty = $('input[name=difficulty]:checked').val();
		}
		if (ActiveRoute.name('newCard')) {
			Meteor.call("addCard", card_id, subjectText, hintText, frontText, backText, Number(difficulty), "0", Number(cardType), lectureText, centerTextElement, date, Number(learningGoalLevel), Number(backgroundStyle), learningUnit, function (error, result) {
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
						if (Number(cardType) === 2) {
							Session.set('difficultyColor', 0);
						} else {
							Session.set('difficultyColor', 1);
						}
						Session.set('learningGoalLevel', 0);
						Session.set('frontText', '');
						Session.set('backText', '');
						Session.set('hintText', '');
						Session.set('lectureText', '');
						Session.set('backgroundStyle', 0);
						Session.set('learningUnit', '');
						if (cardType === 1 || cardType === 3 || cardType === 4) {
							Session.set('centerTextElement', [true, true, false, false]);
						} else {
							Session.set('centerTextElement', [false, false, false, false]);
						}
						window.scrollTo(0, 0);
						$('#editFront').click();
					}
				}
			});
		} else {
			Meteor.call("updateCard", card_id, subjectText, hintText, frontText, backText, Number(difficulty), Number(cardType), lectureText, centerTextElement, date, Number(learningGoalLevel), Number(backgroundStyle), learningUnit);
			Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
			if (returnToCardset) {
				defaultData();
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
				if (Number(cardType) === 2) {
					Session.set('difficultyColor', 0);
				} else {
					Session.set('difficultyColor', 1);
				}
				Session.set('learningGoalLevel', 0);
				Session.set('frontText', '');
				Session.set('backText', '');
				Session.set('hintText', '');
				Session.set('lectureText', '');
				Session.set('backgroundStyle', 0);
				Session.set('learningUnit', '');
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
		return isEditMode();
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
	}
});

/*
 * ############################################################################
 * selectLearningUnit
 * ############################################################################
 */

Template.selectLearningUnit.events({
	'click #noLearningUnit': function () {
		Session.set('subjectText', '');
		Session.set('learningUnit', '');
		$('#showSelectLearningUnitModal').modal('hide');
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
			case 1:
				return TAPi18n.__('card.cardType1.back');
			case 2:
				return TAPi18n.__('card.cardType2.back');
			case 3:
				return TAPi18n.__('card.cardType3.back');
			case 4:
				return TAPi18n.__('card.cardType4.back');
			case 5:
				return TAPi18n.__('card.cardType5.back');
			default:
				return TAPi18n.__('card.cardType0.back');
		}
	},
	getSubjectLabel: function () {
		switch (Session.get('cardType')) {
			case 1:
				return TAPi18n.__('card.cardType1.editorLabels.subject');
			case 2:
				return TAPi18n.__('card.cardType2.editorLabels.subject');
			case 3:
				return TAPi18n.__('card.cardType3.editorLabels.subject');
			case 4:
				return TAPi18n.__('card.cardType4.editorLabels.subject');
			case 5:
				return TAPi18n.__('card.cardType5.editorLabels.subject');
			default:
				return TAPi18n.__('card.cardType0.editorLabels.subject');
		}
	},
	getContent: function () {
		if (Router.current().route.getName() === "newCard") {
			initializeContent();
		} else if (Router.current().route.getName() === "editCard") {
			Session.set('subjectText', this.subject);
			Session.set('frontText', this.front);
			Session.set('backText', this.back);
			Session.set('hintText', this.hint);
			Session.set('cardType', this.cardType);
			Session.set('lectureText', this.lecture);
			Session.set('centerTextElement', this.centerTextElement);
			Session.set('difficultyColor', this.difficulty);
			Session.set('learningGoalLevel', this.learningGoalLevel);
			Session.set('backgroundStyle', this.backgroundStyle);
			Session.set('learningUnit', this.learningUnit);
		}
	},
	getFrontTitle: function () {
		switch (Session.get('cardType')) {
			case 1:
				return TAPi18n.__('card.cardType1.front');
			case 2:
				return TAPi18n.__('card.cardType2.front');
			case 3:
				return TAPi18n.__('card.cardType3.front');
			case 4:
				return TAPi18n.__('card.cardType4.front');
			case 5:
				return TAPi18n.__('card.cardType5.front');
			default:
				return TAPi18n.__('card.cardType0.front');
		}
	},
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, null);
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

Template.editor.onRendered(function () {
	moveEditorButtonGroup();
	$(window).resize(function () {
		moveEditorButtonGroup();
	});
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
	$('.fa-quote-left').addClass('fa-quote-right').removeClass('fa-quote-left');
};

Template.contentEditor.events({
	'keyup #contentEditor': function () {
		$('#contentEditor .md-editor').css('border-color', '');
		$('#helpNewContent').html('');
	}
});

Template.contentEditor.helpers({
	getPlaceholder: function () {
		return setPlaceholderText(Session.get('activeEditMode'), Session.get('cardType'));
	}
});

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if ((Session.get('cardType') === 2 || Session.get('cardType') === 3 || Session.get('cardType') === 5) && Session.get('learningUnit') !== '') {
			let card = Cards.findOne({_id: Session.get('learningUnit')});
			if (card !== undefined && card.subject !== undefined) {
				return card.subject;
			} else {
				return "";
			}
		}
		return Session.get('subjectText');
	},
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, null);
	},
	isDisabled: function () {
		if ((Session.get('cardType') === 2 || Session.get('cardType') === 3 || Session.get('cardType') === 5) && Session.get('learningUnit') !== '') {
			return "disabled";
		}
		return "";
	}
});

Template.subjectEditor.events({
	'keyup #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		Session.set('subjectText', $('#subjectEditor').val());
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subjectText', $('#subjectEditor').val());
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
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, null);
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
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, null);
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
	$(this.find('#cardType5')).on('click change keypress paste focus textInput input', function () {
		defaultToFront(Number($('#cardType5').data('type')));
	});
});

/*
 * ############################################################################
 * cardHintContent
 * ############################################################################
 */

Template.cardHintContent.helpers({
	getSubject: function () {
		if (isEditMode()) {
			return Session.get('subjectText');
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
	getPlaceholder: function () {
		return setPlaceholderText(2);
	},
	gotHint: function () {
		let hint;
		if (isEditMode()) {
			hint = Session.get('hintText');
		} else if (Session.get('selectedHint')) {
			hint = Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
		return hint !== '' && hint !== undefined;
	},
	isCentered: function () {
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).centerTextElement[2];
		}
	},
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, null);
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && isEditMode());
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
	$('#showHintModal').on('hidden.bs.modal', function () {
		$('#showHint').children().removeClass("pressed");
	});
	$('#showCopyCardModal').on('hidden.bs.modal', function () {
		$('#copyCard').children().removeClass("pressed");
	});
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
				return TAPi18n.__('card.cardType0.name');
			case 1:
				return TAPi18n.__('card.cardType1.name');
			case 2:
				return TAPi18n.__('card.cardType2.name');
			case 3:
				return TAPi18n.__('card.cardType3.name');
			case 4:
				return TAPi18n.__('card.cardType4.name');
			case 5:
				return TAPi18n.__('card.cardType5.name');
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
	isCardType: function (cardType1, cardType2 = -1, cardType3 = -1, cardType4 = -1) {
		return isCardType(cardType1, cardType2, cardType3, cardType4, this.cardType);
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
	},
	gotBack: function () {
		return this.back !== '' && this.back !== undefined;
	},
	gotFront: function () {
		return this.front !== '' && this.front !== undefined;
	},
	gotLecture: function () {
		return this.lecture !== '' && this.lecture !== undefined;
	},
	getPlaceholder: function (mode) {
		return setPlaceholderText(mode, this.cardType);
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
		$('#showHint').children().addClass("pressed");
	},
	"click #showLecture": function (evt) {
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: $($(evt.target).data('target')).offset().top
			}, 1000);
		}, 500);
		if (!$('#showLecture').children().hasClass("pressed")) {
			$('#showLecture').children().addClass("pressed");
		} else {
			$('#showLecture').children().removeClass("pressed");
		}
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
		$('#copyCard').children().addClass("pressed");
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
			if ([37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 78, 89, 90, 96, 97, 98, 99, 100, 101].indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 37:
						if ($('#leftCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer(false);
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
						if (Session.get('isQuestionSide')) {
							skipAnswer();
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
							$('#memoRate1').click();
						}
						break;
					case 50:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
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
					case 78:
						if (!Session.get('isQuestionSide')) {
							$('#notknown').click();
						}
						break;
					case 89:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
						}
						break;
					case 90:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
						}
						break;
					case 96:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 97:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate1').click();
						}
						break;
					case 98:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
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

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
			defaultData();
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * deleteCardForm
 * ############################################################################
 */

Template.deleteCardForm.events({
	'click #deleteCardConfirm': function () {
		$('#deleteCardModal').on('hidden.bs.modal', function () {
			Session.set('modifiedCard', undefined);
			Meteor.call("deleteCard", Router.current().params.cardid);
			Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});
