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
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor.js";
import {
	defaultCenteredText,
	gotDictionary,
	gotDifficultyLevel, gotFourColumns, gotHint, gotLearningGoal, gotLearningUnit, gotLecture,
	gotNotesForDifficultyLevel, gotThreeColumns,
	getPlaceholderText, getFrontTitle, getBackTitle, getHintTitle, displaysSideInformation,
	displaysLearningGoalInformation
} from "../../api/cardTypes";
import {backMaxLength, frontMaxLength, hintMaxLength, lectureMaxLength, subjectMaxLength} from "../../api/cards";

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */

export function updateNavigation() {
	let card_id = $('.carousel-inner > .active').attr('data-id');
	Session.set('modifiedCard', card_id);
	let cardType = Cards.findOne({_id: card_id}).cardType;
	Session.set('cardType', Number(cardType));
}

function checkBackgroundStyle() {
	if (Session.get('backgroundStyle')) {
		$(".editorBrush").addClass('pressed');
	} else {
		$(".editorBrush").removeClass('pressed');
	}
}

export function adjustMarkdownToolbar() {
	//btn-group 1
	let btnGroup = $(".btn-toolbar .btn-group:nth-child(1)");
	btnGroup.append($(".btn-toolbar .fa-bold").parent());
	btnGroup.append($(".btn-toolbar .fa-header").parent());
	btnGroup.append($(".btn-toolbar .fa-code").parent());
	btnGroup.append($(".btn-toolbar .fa-link").parent());
	btnGroup.append($(".btn-toolbar .fa-superscript").parent());
	btnGroup.append($(".btn-toolbar .fa-quote-left").parent());
	$('.btn-toolbar .fa-quote-left').addClass('fa-quote-right').removeClass('fa-quote-left');
	//btn-group 2
	btnGroup = $(".btn-toolbar .btn-group:nth-child(2)");
	btnGroup.append($(".btn-toolbar .fa-list").parent());
	btnGroup.append($(".btn-toolbar .fa-list-ol").parent());
	btnGroup.append($(".btn-toolbar .fa-check-square").parent());
	$(".center-button").text('vertical_align_center');
	btnGroup.append($(".center-button").parent());
	//btn-group 3
	btnGroup = $(".btn-toolbar .btn-group:nth-child(3)");
	btnGroup.append($(".btn-toolbar .fa-file-image-o").parent());
	btnGroup.append($(".btn-toolbar .fa-youtube").parent());
	btnGroup.append($(".btn-toolbar .fa-vimeo").parent());
	//btn-group 4
	btnGroup = $(".btn-toolbar .btn-group:nth-child(4)");
	btnGroup.append($(".btn-toolbar .fa-sort-numeric-asc").parent());
	btnGroup.append($(".btn-toolbar .fa-lock").parent());
	btnGroup.append($(".btn-toolbar .editorBrush").parent());
	checkBackgroundStyle();
	$(".btn-toolbar .fullscreen-button").addClass('glyphicon-fullscreen');
	btnGroup.append($(".btn-toolbar .fullscreen-button").parent());
	$(".btn-toolbar .btn-group:nth-child(5)").remove();
}

function resetSessionData(resetSubject = false) {
	defaultCenteredText(Session.get('cardType'));
	if (resetSubject && Session.get('cameFromEditMode') === false) {
		Session.set('subjectText', '');
		Session.set('learningUnit', "0");
		Session.set('learningIndex', "0");
	}
	Session.set('frontText', '');
	Session.set('backText', '');
	Session.set('hintText', '');
	Session.set('lectureText', '');
	Session.set('learningGoalLevel', 0);
	Session.set('backgroundStyle', 0);
	Session.set('cameFromEditMode');
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

/**
 * Function checks if route is a card edit Mode
 * @return {Boolean} Return true, when route is new Card or edit Card.
 */
export function isEditMode() {
	return Router.current().route.getName() === "newCard" || Router.current().route.getName() === "editCard";
}

/**
 * Function checks if route is a presentation view
 * @return {Boolean} Return true, when route is a presentation view.
 */
function isPresentation() {
	return Router.current().route.getName() === "presentation";
}

function isEditModeOrPresentation() {
	return isEditMode() || isPresentation();
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
	if (gotLecture(Session.get('cardType'))) {
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
	if (gotHint(Session.get('cardType'))) {
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
	turnFront();
}

function editBack() {
	prepareBack();
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
	if (gotHint(Session.get('cardType'))) {
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
	if (gotHint(Session.get('cardType'))) {
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

	link = prompt(e.__localize('Füge den Link zum Bild ein. Die Verbindung muss sicher sein, d. h., der Link beginnt mit' +
		' https://... '), 'https://');

	if (link !== null && link !== '' && link !== 'https://' && link.substr(0, 5) === 'https') {
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
let newFlashcardBodyHeight;
let newFlashcardHeader;

function resizeCenterContent() {
	let contentHeight = $('.center-align').height();
	let contentPadding = parseInt($('.cardContent').css('padding-top')) + parseInt($('.cardContent').css('padding-bottom'));
	let newCenterTextHeight = ((((newFlashcardBodyHeight - newFlashcardHeader) - contentPadding) - contentHeight) / 2);
	$('.center-align').css('margin-top', newCenterTextHeight);
	$('.dictionaryFrame').css('height', (newFlashcardBodyHeight - newFlashcardHeader));
}

/**
 * Resizes flashcards to din a6 format
 */
function resizeFlashcards() {
	if (editorFullScreenActive) {
		newFlashcardBodyHeight = ($(window).height() * 0.78);
		$('#contentEditor').css('height', newFlashcardBodyHeight);
	} else {
		newFlashcardHeader = $('.active .cardHeader').outerHeight();
		let editorHeader = $('.btn-toolbar').outerHeight();
		if (Session.get('activeEditMode') >= 2) {
			newFlashcardHeader = 0;
		}
		newFlashcardBodyHeight = ($('#cardCarousel').width() / Math.sqrt(2));
		$('.cardContent').css('height', newFlashcardBodyHeight - newFlashcardHeader);
		if ($(window).width() >= 1200) {
			$('#contentEditor').css('height', (newFlashcardBodyHeight - editorHeader));
		} else {
			$('#contentEditor').css('height', 'unset');
		}
		resizeCenterContent();
	}
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
			icon: 'fa fa-paint-brush editorBrush',
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
			name: 'cmdYouTube',
			title: 'YouTube',
			icon: 'fa fa-youtube',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
			}
		}, {
			name: 'cmdVimeo',
			title: 'Vimeo',
			icon: 'fa fa-vimeo',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
			}
		}, {
			name: 'cmdSetCardnumber',
			title: 'Set the Card Number',
			icon: 'fa fa-sort-numeric-asc',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
			}
		}, {
			name: 'cmdLock',
			title: 'Lock',
			icon: 'fa fa-lock',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
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
	return Router.current().route.getName() === "cardsetdetailsid" || Router.current().route.getName() === "cardsetcard";
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

function getPresentationCards() {
	let query = {};
	if (Session.get('chooseFlashcardsFilter')[0]) {
		query.subject = 1;
		query.front = 1;
	}
	return Cards.find({
		cardset_id: Router.current().params._id,
		learningGoalLevel: {$in: Session.get('chooseFlashcardsFilter')[1]}
	}, {
		sort: {
			query
		}
	});
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

	if (Session.get('learningIndex') === undefined) {
		Session.set('learningIndex', '0');
	}

	if (Session.get('learningUnit') === undefined) {
		Session.set('learningUnit', '0');
	}

	if (Session.get('cardDate') === undefined) {
		Session.set('cardDate', new Date());
	}
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
	let learningIndex = Session.get('learningIndex');
	let learningUnit = Session.get('learningUnit');
	let subjectText = Session.get('subjectText');
	let gotSubject = true;
	if (!gotLearningUnit(cardType)) {
		if (subjectText === "") {
			$('#subjectEditor').css('border', '1px solid');
			$('#subjectEditor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
			gotSubject = false;
		}
	} else {
		if (subjectText === "" && learningUnit === "0") {
			$('#subjectEditor').css('border', '1px solid');
			$('#subjectEditor').css('border-color', '#b94a48');
			Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
			gotSubject = false;
		}
	}
	if ($('#subjectEditor').val().length > subjectMaxLength) {
		$('#subjectEditor .form-control').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_max', {max: subjectMaxLength}), "danger", 'growl-top-left');
	}
	if (frontText.length > frontMaxLength) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max', {max: frontMaxLength}), "danger", 'growl-top-left');
	}
	if (backText.length > backMaxLength) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max', {max: backMaxLength}), "danger", 'growl-top-left');
	}
	if (hintText.length > hintMaxLength) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max', {max: hintMaxLength}), "danger", 'growl-top-left');
	}
	if (gotLecture(cardType) && lectureText.length > lectureMaxLength) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max', {max: lectureMaxLength}), "danger", 'growl-top-left');
	}
	let editorsValidLength = (frontText.length <= frontMaxLength && backText.length <= backMaxLength && lectureText.length <= lectureMaxLength && $('#subjectEditor').val().length <= subjectMaxLength && hintText.length <= hintMaxLength);
	if (gotSubject && editorsValidLength) {
		if (ActiveRoute.name('newCard')) {
			Meteor.call("addCard", Router.current().params._id, subjectText, hintText, frontText, backText, lectureText, centerTextElement, date, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit, function (error, result) {
				if (result) {
					Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
					if (returnToCardset) {
						Router.go('cardsetdetailsid', {
							_id: Router.current().params._id
						});
					} else {
						$('#contentEditor').val('');
						$('#editor').attr('data-content', '');
						resetSessionData();
						window.scrollTo(0, 0);
						$('#editFront').click();
					}
				}
			});
		} else {
			Meteor.call("updateCard", card_id, subjectText, hintText, frontText, backText, lectureText, centerTextElement, date, Number(learningGoalLevel), Number(backgroundStyle), learningIndex, learningUnit);
			Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
			if (returnToCardset) {
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
				Session.set('cameFromEditMode', true);
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
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		saveCard(Router.current().params.card_id, false);
	},
	"click #cardSaveReturn": function () {
		saveCard(Router.current().params.card_id, true);
	}
});

/*
 * ############################################################################
 * selectLearningUnit
 * ############################################################################
 */

Template.selectLearningUnit.helpers({
	getCardsetId: function () {
		return Session.get('tempLearningIndex');
	},
	getCardsetName: function () {
		if (Session.get('tempLearningIndex') === "0") {
			return TAPi18n.__('learningUnit.none');
		} else {
			return Cardsets.findOne({_id: Session.get('tempLearningIndex')}).name;
		}
	},
	gotLearningIndex: function () {
		return Session.get('tempLearningIndex') !== "0";
	},
	learningIndex: function () {
		return Cardsets.find({cardType: 0, visible: true, kind: {$in: ['free', 'edu']}}, {sort: {name: 1}, fields: {name: 1}});
	}
});

Template.selectLearningUnit.events({
	'click .learningIndex': function (evt) {
		let learningIndex = $(evt.currentTarget).attr("data");
		Session.set('tempLearningIndex', learningIndex);
		$('#setLearningIndexLabel').css('color', '');
		$('.setLearningIndexDropdown').css('border-color', '');
		$('#helpLearningIndexType').html('');
		if (learningIndex === "0") {
			$('#showSelectLearningUnitModal').modal('hide');
			Session.set('learningIndex', "0");
			Session.set('learningUnit', "0");
		}
	},
	'click #learningUnitCancel': function () {
		$('#showSelectLearningUnitModal').modal('hide');
	}
});

/*
 * ############################################################################
 * editor
 * ############################################################################
 */

Template.editor.helpers({
	getSubjectLabel: function () {
		return TAPi18n.__('card.cardType' + Session.get('cardType') + '.editorLabels.subject');
	},
	gotLearningGoal: function () {
		return gotLearningGoal(this.cardType);
	},
	getContent: function () {
		if (Router.current().route.getName() === "newCard") {
			Session.set('cardType', Cardsets.findOne({_id: Router.current().params._id}).cardType);
			Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
			resetSessionData(true);
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
			Session.set('learningIndex', this.learningIndex);
		}
	},
	isTextCentered: function () {
		isTextCentered();
	}
});

Template.editor.events({
	'click .editorBrush': function () {
		checkBackgroundStyle();
	}
});

/*
 * ############################################################################
 * contentNavigation
 * ############################################################################
 */
Template.contentNavigation.events({
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

Template.contentNavigation.helpers({
	getBackTitle: function () {
		return TAPi18n.__('card.cardType' + Session.get('cardType') + '.back');
	},
	getFrontTitle: function () {
		return getFrontTitle();
	},
	getHintTitle: function () {
		return getHintTitle();
	},
	gotHint: function () {
		return gotHint(this.cardType);
	},
	gotLecture: function () {
		return gotLecture(this.cardType);
	},
	gotLearningGoal: function () {
		return gotLearningGoal(this.cardType);
	},
	gotFourColumns: function () {
		return gotFourColumns(this.cardType);
	},
	gotThreeColumns: function () {
		return gotThreeColumns(this.cardType);
	}
});

Template.contentNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !isPresentation()) {
		toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.contentNavigation.onRendered(function () {
	$(window).resize(function () {
		if ($(window).width() <= 1200) {
			$("#button-row").insertBefore($("#preview"));
		} else {
			$("#button-row").insertAfter($("#preview"));
		}
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
	adjustMarkdownToolbar();
};

Template.contentEditor.events({
	'keyup #contentEditor': function () {
		$('#contentEditor .md-editor').css('border-color', '');
		$('#helpNewContent').html('');
	}
});

Template.contentEditor.helpers({
	getPlaceholder: function () {
		return getPlaceholderText(Session.get('activeEditMode'), Session.get('cardType'), Session.get('learningGoalLevel'));
	}
});

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if (gotLearningUnit(Session.get('cardType')) && Session.get('learningUnit') !== "0") {
			let card = Cards.findOne({_id: Session.get('learningUnit')});
			if (card !== undefined && card.subject !== undefined) {
				return card.subject;
			} else {
				return "";
			}
		}
		return Session.get('subjectText');
	},
	gotLearningUnit: function () {
		return gotLearningUnit(this.cardType);
	},
	isDisabled: function () {
		if (Session.get('learningUnit') !== "0") {
			return "disabled";
		}
		return "";
	}
});

Template.subjectEditor.events({
	'keyup #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		Session.set('subjectText', $('#subjectEditor').val());
	},
	'click .subjectEditorButton': function () {
		Session.set('tempLearningIndex', Session.get('learningIndex'));
		Session.set('tempLearningUnit', Session.get('learningUnit'));
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subjectText', $('#subjectEditor').val());
};

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
 * cardHintContent
 * ############################################################################
 */

Template.cardHintContent.helpers({
	getSubject: function (presentationSubject = undefined) {
		if (isEditMode()) {
			return Session.get('subjectText');
		} else if (isPresentation()) {
			return presentationSubject;
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		}
	},
	getHint: function (presentationHint = undefined) {
		if (isEditMode()) {
			return Session.get('hintText');
		} else if (isPresentation()) {
			return presentationHint;
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
	},
	getPlaceholder: function () {
		return getPlaceholderText(2);
	},
	gotHint: function (presentationHint = undefined) {
		let hint;
		if (isEditMode()) {
			hint = Session.get('hintText');
		} else if (isPresentation()) {
			hint = presentationHint;
		} else if (Session.get('selectedHint')) {
			hint = Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
		return hint !== '' && hint !== undefined;
	},
	isCentered: function () {
		if (isEditMode()) {
			return Session.get('centerTextElement')[2];
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).centerTextElement[2];
		}
	},
	isEditMode: function () {
		return isEditMode();
	},
	getHintTitle: function () {
		return getHintTitle();
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && isEditModeOrPresentation());
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

let resizeInterval;
Template.flashcards.onRendered(function () {
	Session.set('activeEditMode', 0);
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
	new ResizeSensor($('#cardCarousel'), function () {
		resizeFlashcards();
	});
	if (resizeInterval === undefined && isEditMode()) {
		resizeInterval = setInterval(resizeCenterContent, 250);
	}
	resizeFlashcards();
});

Template.flashcards.onDestroyed(function () {
	if (resizeInterval !== undefined) {
		clearInterval(resizeInterval);
		resizeInterval = undefined;
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
	isCardsetOrPresentation: function () {
		return isCardset() || isPresentation();
	},
	isMemo: function () {
		return isMemo();
	},
	getLearningIndex: function () {
		if (isEditMode()) {
			return Session.get('learningIndex');
		} else {
			return this.learningIndex;
		}
	},
	getLearningUnit: function () {
		if (isEditMode()) {
			return Session.get('learningUnit');
		} else {
			return this.learningUnit;
		}
	},
	gotLearningUnit: function () {
		return (gotLearningUnit(this.cardType) && this.learningUnit !== "0");
	},
	isEditMode: function () {
		return (isEditMode() && !Session.get('fullscreen'));
	},
	isEditModeOrPresentation: function () {
		return isEditModeOrPresentation();
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
	displaysLearningGoalInformation: function () {
		if (Session.get('shuffled')) {
			return displaysLearningGoalInformation(Session.get('cardType'));
		} else {
			return displaysLearningGoalInformation(this.cardType);
		}
	},
	displaysSideInformation: function () {
		if (Session.get('shuffled')) {
			return displaysSideInformation(Session.get('cardType'));
		} else {
			return displaysSideInformation(this.cardType);
		}
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
		if (isPresentation()) {
			return getPresentationCards();
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
		let activeCardType = this.cardType;
		if (Session.get('shuffled')) {
			activeCardType = Session.get('cardType');
		}
		return TAPi18n.__('card.cardType' + activeCardType + '.name');
	},
	getLearningGoalName: function () {
		return TAPi18n.__('learning-goal.level' + (this.learningGoalLevel + 1));
	},
	gotHint: function () {
		if (Session.get('shuffled')) {
			return gotHint(Session.get('cardType'));
		} else {
			return gotHint(this.cardType);
		}
	},
	gotDictionary: function () {
		if (Session.get('shuffled')) {
			return gotDictionary(Session.get('cardType'));
		} else {
			return gotDictionary(this.cardType);
		}
	},
	gotLecture: function () {
		if (Session.get('shuffled')) {
			return gotLecture(Session.get('cardType'));
		} else {
			return gotLecture(this.cardType);
		}
	},
	gotLecturePreview: function () {
		if (isEditMode()) {
			return Session.get('activeEditMode') === 3 && Session.get('lectureText');
		} else {
			return Session.get('activeEditMode') === 3 && (this.lecture !== "" && this.lecture !== undefined);
		}
	},
	getFrontTitle: function () {
		if (Session.get('shuffled')) {
			return getFrontTitle(Session.get('cardType'));
		} else {
			return getFrontTitle(this.cardType);
		}
	},
	getBackTitle: function () {
		if (Session.get('shuffled')) {
			return getBackTitle(Session.get('cardType'));
		} else {
			return getBackTitle(this.cardType);
		}
	},
	gotDifficultyLevel: function () {
		if (Session.get('shuffled')) {
			return gotDifficultyLevel(Session.get('cardType'));
		} else {
			return gotDifficultyLevel(this.cardType);
		}
	},
	gotLearningGoal: function () {
		if (Session.get('shuffled')) {
			return gotLearningGoal(Session.get('cardType'));
		} else {
			return gotLearningGoal(this.cardType);
		}
	},
	gotNotesForDifficultyLevel: function () {
		if (Session.get('shuffled')) {
			return gotNotesForDifficultyLevel(Session.get('cardType'));
		} else {
			return gotNotesForDifficultyLevel(this.cardType);
		}
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	isFrontPreview: function () {
		return (Session.get('activeEditMode') === 0 && isEditModeOrPresentation());
	},
	isBackPreview: function () {
		return (Session.get('activeEditMode') === 1 && isEditModeOrPresentation());
	},
	isLecturePreview: function () {
		if (gotLecture(this.cardType)) {
			return (Session.get('activeEditMode') === 3 && isEditModeOrPresentation());
		} else {
			return false;
		}
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && isEditModeOrPresentation());
	},
	isCentered: function (type) {
		if (isEditModeOrPresentation()) {
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
	getPlaceholder: function (mode) {
		if (Session.get('shuffled')) {
			return getPlaceholderText(mode, Session.get('cardType'), this.learningGoalLevel);
		} else {
			return getPlaceholderText(mode, this.cardType, this.learningGoalLevel);
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
		if (isPresentation()) {
			$('#editFront').click();
			$('#cardCarousel').on('slid.bs.carousel', function () {
				updateNavigation();
			});
		}
	},
	"click .box": function (evt) {
		if (Session.get('activeEditMode') !== 2 && Session.get('activeEditMode') !== 3 && ($(evt.target).data('type') !== "cardNavigation") && ($(evt.target).data('type') !== "cardImage") &&  !$(evt.target).is('a, a *')) {
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
			Meteor.call("deleteCard", Router.current().params.card_id);
			Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});
