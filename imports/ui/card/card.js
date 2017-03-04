//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./card.html";


/*
 * ############################################################################
 * btnCard
 * ############################################################################
 */

/*
 * ############################################################################
 * Functions
 * ############################################################################
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

Template.btnCard.helpers({
	isEditMode: function () {
		return ActiveRoute.name('editCard');
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
		if ($('#titleEditor').val() === '') {
			$('#titleEditor .form-control').css('border-color', '#b94a48');
			$('#helpNewTitletext').html(TAPi18n.__('title_required'));
			$('#helpNewTitletext').css('color', '#b94a48');
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
		if ($('#titleEditor').val().length > 150) {
			$('#titleEditor .form-control').css('border-color', '#b94a48');
			$('#helpNewTitletext').html(TAPi18n.__('title_max'));
			$('#helpNewTitletext').css('color', '#b94a48');
		}
		if ($('#hintEditor').val().length > 10000) {
			$('#hinttext .md-editor').css('border-color', '#b94a48');
			$('#helpNewHinttext').html(TAPi18n.__('text_max'));
			$('#helpNewHinttext').css('color', '#b94a48');
		}
		if ($('#frontEditor').val() !== '' && $('#backEditor').val() !== '' && $('#titleEditor').val() !== '' && $('#frontEditor').val().length <= 10000 && $('#backEditor').val().length <= 10000 && $('#titleEditor').val().length <= 150 && $('#hintEditor').val().length <= 10000) {
			var title = $('#titleEditor').val();
			var front = $('#frontEditor').val();
			var back = $('#backEditor').val();
			var hint = $('#hintEditor').val();
			var difficulty = $('input[name=difficulty]:checked').val();
			if (ActiveRoute.name('newCard')) {
				Meteor.call("addCard", this._id, title, hint, front, back, Number(difficulty));
			} else {
				Meteor.call("updateCard", this._id, title, hint, front, back, Number(difficulty));
			}
			window.history.go(-1);
		}
	},
	'click #cardDelete': function () {
		$("#cardDelete").remove();
		$("#changeDeleteButton").html('<button id="cardConfirm" class="btn btn-warning btn-large" onclick="history.go(-1)">' + TAPi18n.__("confirmcard") + '</button>');
	},
	'click #cardConfirm': function () {
		var id = this._id;
		Meteor.call("deleteCard", id);
	}
});

/*
 * ############################################################################
 * frontEditor
 * ############################################################################
 */

Template.frontEditor.helpers({
	getFront: function () {
		if (Session.get('frontText') !== undefined) {
			return Session.get('frontText');
		}  else {
			return "";
		}
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

Template.backEditor.helpers({
	getBack: function () {
		if (Session.get('backText') !== undefined) {
			return Session.get('backText');
		} else {
			return "";
		}
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

Template.hintEditor.helpers({
	getHint: function () {
		if (Session.get('hintText') !== undefined) {
			return Session.get('hintText');
		} else {
			return "";
		}
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
		if (this.difficulty === undefined && type === 0) {
			return true;
		} else if (type == this.difficulty) {
			return true;
		} else {
			return false;
		}
	}
});
