//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
import "./card.html";
import '/client/hammer.js';

Session.setDefault('frontText', '');
Session.setDefault('backText', '');
Session.setDefault('hintText', '');

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */
var activeEditMode = 0;
function editFront() {
	activeEditMode = 0;
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 4);
	$('#contentEditor').val(Session.get('frontText'));
	$('#editor').attr('data-content', Session.get('frontText'));
	$('#editFront').removeClass('btn-default').addClass('btn-primary');
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	turnFront();
}

function editBack() {
	activeEditMode = 1;
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 6);
	$('#contentEditor').val(Session.get('backText'));
	$('#editor').attr('data-content', Session.get('backText'));
	$('#editBack').removeClass('btn-default').addClass('btn-primary');
	$('#editFront').removeClass('btn-primary').addClass('btn-default');
	$('#editHint').removeClass('btn-primary').addClass('btn-default');
	turnBack();
}

function editHint() {
	activeEditMode = 2;
	$('#contentEditor').focus();
	$('#contentEditor').attr('tabindex', 8);
	$('#contentEditor').val(Session.get('hintText'));
	$('#editor').attr('data-content', Session.get('hintText'));
	$('#editHint').removeClass('btn-default').addClass('btn-primary');
	$('#editFront').removeClass('btn-primary').addClass('btn-default');
	$('#editBack').removeClass('btn-primary').addClass('btn-default');
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

function turnBack() {
	$(".cardfront-symbol").css('display', "none");
	$(".cardback-symbol").css('display', "");
	$(".cardfront").css('display', "none");
	$(".cardback").css('display', "");
	$(".box").addClass("flipped");
	$(".innerBoxHeader").addClass("back");
	$(".innerBoxBody").addClass("back");
}

function turnFront() {
	$(".cardfront-symbol").css('display', "");
	$(".cardback-symbol").css('display', "none");
	$(".cardfront").css('display', "");
	$(".cardback").css('display', "none");
	$(".box").removeClass("flipped");
	$(".innerBoxHeader").removeClass("back");
	$(".innerBoxBody").removeClass("back");
}

var lastWidth = $("#cardCarousel").width();

/**
 * Resizes flashcards to din a6 format
 */
function resizeFlashcards() {
	let flashcardWidth = $('#cardCarousel').width();
	if (flashcardWidth != lastWidth) {
		let flashcardHeaderHeight = $('.innerBoxHeader').height();
		let newFlashcardHeight = flashcardWidth / Math.sqrt(2);
		let newFlashcardBodyHeight = newFlashcardHeight - flashcardHeaderHeight;
		$('.box').css('min-height', newFlashcardHeight);
		$('.innerBoxBody').css('min-height', newFlashcardBodyHeight);
		lastWidth = $("#cardCarousel").width();
	}
	setTimeout(resizeFlashcards, 250);
}

/**
 * Toggle the card view between fullscreen and normal mode
 */
export function toggleFullscreen(forceOff = false) {
	if (Session.get('fullscreen') || forceOff) {
		Session.set('fullscreen', false);
		$("#theme-wrapper").css("margin-top", "100px");
		$("#answerOptions").css("margin-top", "0");
	} else {
		Session.set('fullscreen', true);
		$("#theme-wrapper").css("margin-top", "20px");
		$("#answerOptions").css("margin-top", "-80px");
	}
}

/**
 * Function changes from the backside to the front side of
 * a card or the other way around
 */
export function turnCard() {
	if ($(".cardfront").css('display') === 'none') {
		turnFront();
	} else if ($(".cardback").css('display') === 'none') {
		turnBack();
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
 * @return {Boolean} Return true, when route is a Cardset.
 */
function isCardset() {
	return Router.current().route.getName() === "cardsetdetailsid";
}

/**
 * Function checks if route is a card edit Mode
 * @return {Boolean} Return true, when route is new Card or edit Card.
 */
function isEditMode() {
	return Router.current().route.getName() === "newCard" || Router.current().route.getName() === "editCard";
}

/**
 * Function checks if route is a Cardset
 * @return {Boolean} Return true, when route is a Memo.
 */
function isMemo() {
	return Router.current().route.getName() === "memo";
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
	var cards = [];
	var learnedCards = Learned.find({
		cardset_id: Session.get('activeCardset')._id,
		user_id: Meteor.userId(),
		active: true
	}, {
		sort: {
			currentDate: 1
		}
	});

	learnedCards.forEach(function (learnedCard) {
		var card = Cards.findOne({
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
		"front": Session.get('frontText'),
		"back": Session.get('backText'),
		"hint": Session.get('hintText'),
		"cardset_id": Router.current().params._id,
		"cardGroup": 0
	}];
}

/**
 * Get a set of cards for the supermemo algorithm.
 * @return {Collection} The card collection
 */
function getMemoCards() {
	var actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	actualDate.setHours(0, 0, 0, 0);

	var learned = Learned.findOne({
		cardset_id: Session.get('activeCardset')._id,
		user_id: Meteor.userId(),
		nextDate: {
			$lte: actualDate
		}
	}, {
		sort: {
			nextDate: 1
		}
	});
	if (learned !== undefined) {
		var cards = Cards.find({
			_id: learned.card_id
		}).fetch();
		Session.set('currentCard', learned.card_id);
		return cards;
	}
}

function saveCard(card_id, returnToCardset) {
	let frontText = Session.get('frontText');
	let backText = Session.get('backText');
	let hintText = Session.get('hintText');
	if ($('#subjectEditor').val() === '') {
		$('#subjectEditor').css('border', '1px solid');
		$('#subjectEditor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_required'), "danger", 'growl-top-left');
	}
	if ($('#subjectEditor').val().length > 150) {
		$('#subjectEditor .form-control').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('cardsubject_max'), "danger", 'growl-top-left');
	}
	if (frontText  === '') {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('fronttext_required'), "danger", 'growl-top-left');
	}
	if (backText === '') {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('backtext_required'), "danger", 'growl-top-left');
	}
	if (frontText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	if (backText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	if (hintText.length > 10000) {
		$('#editor .md-editor').css('border-color', '#b94a48');
		Bert.alert(TAPi18n.__('text_max'), "danger", 'growl-top-left');
	}
	let editorsEmpty = frontText !== '' && backText !== '' && $('#subjectEditor').val() !== '';
	let editorsValidLength = frontText.length <= 10000 && backText.length <= 10000 && $('#subjectEditor').val().length <= 150 && hintText.length <= 10000;
	if (editorsEmpty && editorsValidLength) {
		let subject = $('#subjectEditor').val();
		let front = frontText;
		let back = backText;
		let hint = hintText;
		let difficulty = $('input[name=difficulty]:checked').val();
		if (ActiveRoute.name('newCard')) {
			Meteor.call("addCard", card_id, subject, hint, front, back, Number(difficulty), "0", function (error, result) {
				if (result) {
					Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
					if (returnToCardset) {
						Session.set('modifiedCard', result);
						Router.go('cardsetdetailsid', {
							_id: Router.current().params._id
						});
					} else {
						$('#contentEditor').val('');
						$('#editor').attr('data-content', '');
						Session.set('frontText', '');
						Session.set('backText', '');
						Session.set('hintText', '');
						window.scrollTo(0, 0);
						$('#editFront').click();
						$('#difficulty0').click();
					}
				}
			});
		} else {
			Meteor.call("updateCard", card_id, subject, hint, front, back, Number(difficulty));
			Bert.alert(TAPi18n.__('savecardSuccess'), "success", 'growl-top-left');
			if (returnToCardset) {
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
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
	'click #editHint': function () {
		editHint();
	},
	'focus #editFront': function () {
		editFront();
	},
	'focus #editBack': function () {
		editBack();
	},
	'focus #editHint': function () {
		editHint();
	}
});

Template.editor.helpers({
	getContent: function (front, back, hint) {
		if (front === undefined) {
			front = '';
		}
		Session.set('frontText', front);
		if (back === undefined) {
			back = '';
		}
		Session.set('backText', back);
		if (hint === undefined) {
			hint = '';
		}
		Session.set('hintText', hint);
	}
});

Template.editor.onCreated(function () {
	if (Session.get('fullscreen')) {
		toggleFullscreen();
	}
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
			switch (activeEditMode) {
				case 0:
					Session.set('frontText', content);
					break;
				case 1:
					Session.set('backText', content);
					break;
				case 2:
					Session.set('hintText', content);
					break;
			}
		},
		additionalButtons: [
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
				}]
			}]
		]
	});

	if (!ActiveRoute.name('editCard')) {
		Session.set('frontText', '');
	}
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
	$('#subjectEditor').focus();
	Session.set('subjectEditorText', $('#subjectEditor').val());
};

/*
 * ############################################################################
 * difficultyEditor
 * ############################################################################
 */

Template.difficultyEditor.helpers({
	isDifficultyChecked: function (type) {
		return ((this.difficulty === undefined && type === 0) || (type === this.difficulty));
	}
});

Template.difficultyEditor.events({
	'click #difficultyGroup': function (event) {
		Session.set('difficultyColor', Number($(event.target).data('color')));
	},
	'focus #difficulty0': function () {
		Session.set('difficultyColor', 0);
	},
	'focus #difficulty1': function () {
		Session.set('difficultyColor', 1);
	},
	'focus #difficulty2': function () {
		Session.set('difficultyColor', 2);
	},
	'focus #difficulty3': function () {
		Session.set('difficultyColor', 3);
	}
});

Template.difficultyEditor.onRendered(function () {
	Session.set('difficultyColor', Number($('input[name=difficulty]:checked').val()));
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
	}
});

/*
 * ############################################################################
 * flashcards
 * ############################################################################
 */

Template.flashcards.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
});

Template.flashcards.onRendered(function () {
	if (Router.current().route.getName() === "cardsetdetailsid") {
		var mc = new Hammer.Manager(document.getElementById('set-details-region'));
		mc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50}));
		mc.on("swipe", function (ev) {
			if (ev.deltaX < 0) {
				document.getElementById('rightCarouselControl').click();
			} else {
				document.getElementById('leftCarouselControl').click();
			}
		});
	}
	resizeFlashcards();
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
		return isEditMode();
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
		var maxIndex = Learned.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: parseInt(Session.get('selectedBox'))
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	countLeitner: function () {
		var maxIndex = Learned.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	getCardsetCount: function () {
		return Cardsets.findOne({_id: Router.current().params._id}).quantity;
	},
	getCardsetName: function () {
		return Cardsets.findOne({_id: this.cardset_id}).name;
	}
});

Template.flashcards.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		turnFront();
	},
	"click .box": function (evt) {
		if (!isMemo() && ($(evt.target).data('type') !== "cardNavigation") && ($(evt.target).data('type') !== "cardImage")) {
			turnCard();
		}
	},
	"click #showHint": function (evt) {
		Session.set('selectedHint', $(evt.target).data('id'));
	},
	"click #editCard": function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
	},
	"click #copyCard": function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
	},
	"click #toggleFullscreen": function () {
		toggleFullscreen();
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
});

Template.flashcardsEmpty.events({
	'click #memoEndBtn': function () {
		window.history.go(-1);
	}
});

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return isBox();
	},
	isCardset: function () {
		return isCardset();
	}
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
			shuffled: false
		}, {
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
