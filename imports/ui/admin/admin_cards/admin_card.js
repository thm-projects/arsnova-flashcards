//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import "./admin_card.html";
import {image, tex} from '/imports/ui/card/card.js';

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
	var templateMarkdown = function (sessionID) {
		return {
			autofocus: false,
			hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
			fullscreen: false,
			iconlibrary: "fa",
			onChange: function (e) {
				var content = e.getContent();
				Session.set(sessionID, content);
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
