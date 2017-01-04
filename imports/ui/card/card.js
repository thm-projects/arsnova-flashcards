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
		if ($('#frontEditor').val() !== '' && $('#backEditor').val() !== '' && $('#frontEditor').val().length <= 10000 && $('#backEditor').val().length <= 10000) {
			var front = Session.get('frontText');
			var back = Session.get('backText');
			if (ActiveRoute.name('newCard')) {
				Meteor.call("addCard", this._id, front, back);
			} else {
				Meteor.call("updateCard", this._id, front, back);
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

Template.frontEditor.rendered = function () {
	$("#frontEditor").markdown({
		autofocus: true,
		hiddenButtons: ["cmdPreview", "cmdImage"],
		fullscreen: false,
		footer: "<p></p>",
		onChange: function (e) {
			var content = e.getContent();
			Session.set('frontText', content);
			if (content !== "") {
				Meteor.promise("convertMarkdown", content)
					.then(function (rendered) {
						$("#fronttext .md-footer").html(rendered);
					});
			}
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
		if (front !== "") {
			Meteor.promise("convertMarkdown", front)
				.then(function (rendered) {
					$("#fronttext .md-footer").html(rendered);
				})
				.catch(function (error) {
					throw new Meteor.Error(error, "Can't convert to Markdown");
				});
		}
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

Template.backEditor.rendered = function () {
	$("#backEditor").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage"],
		fullscreen: false,
		footer: "<p></p>",
		onChange: function (e) {
			var content = e.getContent();
			Session.set('backText', content);
			if (content !== "") {
				Meteor.promise("convertMarkdown", content)
					.then(function (rendered) {
						$("#backtext .md-footer").html(rendered);
					});
			}
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
		if (back !== "") {
			Meteor.promise("convertMarkdown", back)
				.then(function (rendered) {
					$("#backtext .md-footer").html(rendered);
				})
				.catch(function (error) {
					throw new Meteor.Error(error, "Can't convert to Markdown");
				});
		}
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
