//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import "./admin_card.html";

/*
 * ############################################################################
 * Functions
 * ############################################################################
 */

function tex(e) {
	// Give/remove ** surround the selection
	var chunk, cursor, selected = e.getSelection(),
		content = e.getContent();

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

/*
 * ############################################################################
 * admin_card
 * ############################################################################
 */

Template.admin_card.helpers({
	getUsernameCard: function (cardset_id) {
		if (cardset_id) {
			var cardset = Cardsets.findOne({_id: cardset_id});
			return cardset.username;
		} else {
			return null;
		}
	},
	userExistsCard: function (cardset_id) {
		if (cardset_id) {
			var cardset = Cardsets.findOne({_id: cardset_id});

			return (!cardset.userDeleted);
		}
	},
	getCardsetname: function (cardset_id) {
		if (cardset_id) {
			var cardset = Cardsets.findOne({_id: cardset_id});
			return cardset.name;
		} else {
			return null;
		}
	},
	getUserId: function (cardset_id) {
		var cardset = Cardsets.findOne({_id: cardset_id});
		return cardset.owner;
	},
	getFront: function () {
		if (Session.get('frontText') !== undefined) {
			return Session.get('frontText');
		} else {
			return "";
		}
	},
	getBack: function () {
		if (Session.get('backText') !== undefined) {
			return Session.get('backText');
		} else {
			return "";
		}
	},
	getHint: function () {
		if (Session.get('hintText') !== undefined) {
			return Session.get('hintText');
		} else {
			return "";
		}
	},
	isDifficultyChecked: function (type) {
		if ((this.difficulty === undefined && type === 0) || ((type == this.difficulty))) {
			return true;
		} else {
			return false;
		}
	}
});

Template.admin_card.events({
	"click #cardSaveAdmin": function () {
		if ($('#editCardFrontAdmin').val().length <= 0 ||
			$('#editCardFrontAdmin').val().length > 10000) {
			$('#frontAdmin .md-editor').css('border-color', '#b94a48');
			$('#helpEditCardFrontAdmin').css('color', '#b94a48');
			if ($('#editCardFrontAdmin').val().length > 10000) {
				$('#helpEditCardFrontAdmin').html(TAPi18n.__('text_max'));
			} else {
				$('#helpEditCardFrontAdmin').html(TAPi18n.__('admin.card.front_required'));
			}
		}
		if ($('#editCardBackAdmin').val().length <= 0 ||
			$('#editCardBackAdmin').val().length > 10000) {
			$('#backAdmin .md-editor').css('border-color', '#b94a48');
			$('#helpEditCardBackAdmin').css('color', '#b94a48');
			if ($('#editCardBackAdmin').val().length > 10000) {
				$('#helpEditCardBackAdmin').html(TAPi18n.__('text_max'));
			} else {
				$('#helpEditCardBackAdmin').html(TAPi18n.__('admin.card.back_required'));
			}
		}
		if ($('#editCardHintAdmin').val().length > 10000) {
			$('#hintAdmin .md-editor').css('border-color', '#b94a48');
			$('#helpEditCardHintAdmin').html(TAPi18n.__('text_max'));
			$('#helpEditCardHintAdmin').css('color', '#b94a48');
		}
		if ($('#subjectEditor').val().length <= 0 || $('#subjectEditor').val().length > 150) {
			$('#subjectEditor .form-control').css('border-color', '#b94a48');
			$('#helpNewSubjecttext').css('color', '#b94a48');
			if ($('#subjectEditor').val().length > 150) {
				$('#helpEditCardSubjectAdmin').html(TAPi18n.__('cardsubject_max'));
			} else {
				$('#helpEditCardSubjectAdmin').html(TAPi18n.__('cardsubject_required'));
			}
		}
		if ($('#editCardFrontAdmin').val() !== '' && $('#editCardBackAdmin').val() !== '' && $('#subjectEditor').val() !== '' && $('#editCardFrontAdmin').val().length <= 10000 && $('#editCardBackAdmin').val().length <= 10000 && $('#editCardHintAdmin').val().length <= 10000 && $('#subjectEditor').val().length <= 150) {
			var subject = $('#subjectEditor').val();
			var hint =  $('#editCardHintAdmin').val();
			var front = $('#editCardFrontAdmin').val();
			var back = $('#editCardBackAdmin').val();
			var difficulty = $('input[name=difficulty]:checked').val();
			Meteor.call("updateCard", this._id, subject, hint, front, back, Number(difficulty));
			window.history.go(-1);
		}
	},
	'click #cardCancelAdmin': function () {
		window.history.go(-1);
	},
	'click #cardDeleteAdmin': function () {
		$("#cardDeleteAdmin").css('display', "none");
		$("#cardConfirmAdmin").css('display', "");
	},
	'click #cardConfirmAdmin': function () {
		var id = this._id;
		Meteor.call("deleteCardAdmin", id);
		window.history.go(-1);
	},
	'keyup #editCardFrontAdmin': function () {
		$('#frontAdmin .md-editor').css('border-color', '');
		$('#helpEditCardFrontAdmin').html('');
	},
	'keyup #editCardBackAdmin': function () {
		$('#backAdmin .md-editor').css('border-color', '');
		$('#helpEditCardBackAdmin').html('');
	},
	'keyup #editCardHintAdmin': function () {
		$('#hintAdmin .md-editor').css('border-color', '');
		$('#helpEditCardHintAdmin').html('');
	}
});

Template.admin_card.rendered = function () {
	var additBtn = [
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
	];

	var templateMarkdown = function (sessionID) {
		return {
			autofocus: false,
			hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
			fullscreen: false,
			onChange: function (e) {
				var content = e.getContent();
				Session.set(sessionID, content);
			},
			additionalButtons: additBtn
		};
	};

	$("#editCardFrontAdmin").markdown(templateMarkdown("frontText"));

	$("#editCardBackAdmin").markdown(templateMarkdown("backText"));

	$("#editCardHintAdmin").markdown(templateMarkdown("hintText"));

	if (ActiveRoute.name('adminCard')) {
		var back = String($('#backAdmin').data('content'));
		var front = String($('#frontAdmin').data('content'));
		var hint = String($('#hintAdmin').data('content'));
		Session.set('backText', back);
		Session.set('frontText', front);
		Session.set('hintText', hint);
	} else {
		Session.set('backText', undefined);
		Session.set('frontText', undefined);
		Session.set('hintText', undefined);
	}
};
