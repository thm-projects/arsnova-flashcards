//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
import "./card.html";
import '/client/hammer.js';

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */

/**
 * Surrounds a selected text with the markdown tags for an image.
 * @param {event} e - The DOM Event
 */
function image(e) {
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

function tex(e) {
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
 * Function checks if route is a Cardset
 * @return {Boolean} Return true, when route is a Memo.
 */
function isMemo() {
	return Router.current().route.getName() === "memo";
}

function getCardsetCards() {
	var query = Cards.find({cardset_id: Session.get('activeCardset')._id}, {sort: {subject: 1, front: 1}});

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
			cardset_id: Session.get('activeCardset')._id,
			_id: learned.card_id
		}).fetch();
		Session.set('currentCard', learned.card_id);
		return cards;
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
		if ($('#frontEditor').val() === '') {
			$('#fronttext .md-editor').css('border-color', '#b94a48');
			$('#helpNewFronttext').html(TAPi18n.__('fronttext_required'));
			$('#helpNewFronttext').css('color', '#b94a48');
		}
		if ($('#backEditor').val() === '') {
			$('#backtext .md-editor').css('border-color', '#b94a48');
			$('#helpNewBacktext').html(TAPi18n.__('backtext_required'));
			$('#helpNewBacktext').css('color', '#b94a48');
		}
		if ($('#subjectEditor').val() === '') {
			$('#subjectEditor .form-control').css('border-color', '#b94a48');
			$('#helpNewSubjecttext').html(TAPi18n.__('cardsubject_required'));
			$('#helpNewSubjecttext').css('color', '#b94a48');
		}
		if ($('#frontEditor').val().length > 10000) {
			$('#fronttext .md-editor').css('border-color', '#b94a48');
			$('#helpNewFronttext').html(TAPi18n.__('text_max'));
			$('#helpNewFronttext').css('color', '#b94a48');
		}
		if ($('#backEditor').val().length > 10000) {
			$('#backtext .md-editor').css('border-color', '#b94a48');
			$('#helpNewBacktext').html(TAPi18n.__('text_max'));
			$('#helpNewBacktext').css('color', '#b94a48');
		}
		if ($('#subjectEditor').val().length > 150) {
			$('#subjectEditor .form-control').css('border-color', '#b94a48');
			$('#helpNewSubjecttext').html(TAPi18n.__('cardsubject_max'));
			$('#helpNewSubjecttext').css('color', '#b94a48');
		}
		if ($('#hintEditor').val().length > 10000) {
			$('#hinttext .md-editor').css('border-color', '#b94a48');
			$('#helpNewHinttext').html(TAPi18n.__('text_max'));
			$('#helpNewHinttext').css('color', '#b94a48');
		}
		var editorsEmpty = $('#frontEditor').val() !== '' && $('#backEditor').val() !== '' && $('#subjectEditor').val() !== '';
		var editorsValidLength = $('#frontEditor').val().length <= 10000 && $('#backEditor').val().length <= 10000 && $('#subjectEditor').val().length <= 150 && $('#hintEditor').val().length <= 10000;
		if (editorsEmpty && editorsValidLength) {
			var subject = $('#subjectEditor').val();
			var front = $('#frontEditor').val();
			var back = $('#backEditor').val();
			var hint = $('#hintEditor').val();
			var difficulty = $('input[name=difficulty]:checked').val();
			if (ActiveRoute.name('newCard')) {
				Meteor.call("addCard", this._id, subject, hint, front, back, Number(difficulty), "0");
			} else {
				Meteor.call("updateCard", this._id, subject, hint, front, back, Number(difficulty));
			}
			window.history.go(-1);
		}
	},
	'click #cardCancel': function () {
		window.history.go(-1);
	},
	'click #cardDelete': function () {
		$("#cardDelete").remove();
		$("#cardDeleteConfirm").css('display', "");
	},
	'click #cardDeleteConfirm': function () {
		var id = this._id;
		Session.set('modifiedCard', undefined);
		Meteor.call("deleteCard", id);
		window.history.go(-1);
	}
});

/*
 * ############################################################################
 * frontEditor
 * ############################################################################
 */

/**
 * Returns the front text of a card
 * @return front text
 */
Template.frontEditor.helpers({
	getFront: function () {
		if (Session.get('frontText') !== undefined) {
			return Session.get('frontText');
		}
		return "";
	}
});

Template.frontEditor.rendered = function () {
	$("#frontEditor").markdown({
		autofocus: true,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		onChange: function (e) {
			var content = e.getContent();
			Session.set('frontText', content);
		},
		additionalButtons: [
			[{
				name: "groupCustom",
				data: [{
					name: 'cmdPics',
					title: 'Image',
					icon: 'glyphicon glyphicon-picture',
					callback: image
				}, {
					name: "cmdTex",
					title: "Tex",
					icon: "glyphicon glyphicon-usd",
					callback: tex
				}]
			}]
		]
	});

	if (ActiveRoute.name('editCard')) {
		var front = String($('#fronttext').data('content'));
		Session.set('frontText', front);
	} else {
		Session.set('frontText', undefined);
	}
};

Template.frontEditor.events({
	'keyup #frontEditor': function () {
		$('#fronttext .md-editor').css('border-color', '');
		$('#helpNewFronttext').html('');
	}
});

/*
 * ############################################################################
 * backEditor
 * ############################################################################
 */

/**
 * Returns the back text of a card
 * @return back text
 */
Template.backEditor.helpers({
	getBack: function () {
		if (Session.get('backText') !== undefined) {
			return Session.get('backText');
		}
		return "";
	}
});

Template.backEditor.rendered = function () {
	$("#backEditor").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		onChange: function (e) {
			var content = e.getContent();
			Session.set('backText', content);
		},
		additionalButtons: [
			[{
				name: "groupCustom",
				data: [{
					name: 'cmdPics',
					title: 'Image',
					icon: 'glyphicon glyphicon-picture',
					callback: image
				}, {
					name: "cmdTex",
					title: "Tex",
					icon: "glyphicon glyphicon-usd",
					callback: tex
				}]
			}]
		]
	});
	if (ActiveRoute.name('editCard')) {
		var back = String($('#backtext').data('content'));
		Session.set('backText', back);
	} else {
		Session.set('backText', undefined);
	}
};

Template.backEditor.events({
	'keyup #backEditor': function () {
		$('#backtext .md-editor').css('border-color', '');
		$('#helpNewBacktext').html('');
	}
});


/*
 * ############################################################################
 * HintEditor
 * ############################################################################
 */

/**
 * Returns the hint text of a card
 * @return hint of the card
 */
Template.hintEditor.helpers({
	getHint: function () {
		if (Session.get('hintText') !== undefined) {
			return Session.get('hintText');
		}
		return "";
	}
});

Template.hintEditor.rendered = function () {
	$("#hintEditor").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		onChange: function (e) {
			var content = e.getContent();
			Session.set('hintText', content);
		},
		additionalButtons: [
			[{
				name: "groupCustom",
				data: [{
					name: 'cmdPics',
					title: 'Image',
					icon: 'glyphicon glyphicon-picture',
					callback: image
				}, {
					name: "cmdTex",
					title: "Tex",
					icon: "glyphicon glyphicon-usd",
					callback: tex
				}]
			}]
		]
	});
	if (ActiveRoute.name('editCard')) {
		var hint = String($('#hinttext').data('content'));
		Session.set('hintText', hint);
	} else {
		Session.set('hintText', undefined);
	}
};

Template.backEditor.events({
	'keyup #hintEditor': function () {
		$('#hinttext .md-editor').css('border-color', '');
		$('#helpNewHinttext').html('');
	}
});

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

/*
 * ############################################################################
 * cardHint
 * ############################################################################
 */

Template.cardHint.helpers({
	getSubject: function () {
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		}
	},
	getHint: function () {
		if (Session.get('selectedHint')) {
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
			cardset_id: this.cardset_id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	}
});

Template.flashcards.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		turnFront();
	},
	"click .box": function (evt) {
		if (!isMemo() && ($(evt.target).data('type') !== "showHint") && ($(evt.target).data('type') !== "cardImage")) {
			turnCard();
		}
	},
	"click #showHint": function (evt) {
		Session.set('selectedHint', $(evt.target).data('id'));
	},
	"click #editCard": function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
	}
});

/*
 * ############################################################################
 * flashcardsEmpty
 * ############################################################################
 */

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
