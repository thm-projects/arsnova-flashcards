import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetForm.html";
import {Cardsets} from "../../api/cardsets.js";
import {CardType} from '../../api/cardTypes.js';
import {Route} from '../../api/route.js';
import {BertAlertVisuals} from "../../api/bertAlertVisuals";

export function isNewCardset() {
	return Session.get('isNewCardset');
}

function adjustDifficultyColor() {
	if (Route.isCardset()) {
		Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
	} else {
		let difficulty = 0;
		if (!CardType.gotNotesForDifficultyLevel(Session.get('cardType'))) {
			difficulty = 1;
		}
		Session.set('difficultyColor', difficulty);
	}
}

export function cleanModal() {
	if (Route.isShuffle()) {
		$('#setName').val(Session.get("ShuffleTemplate").name);
	} else if (isNewCardset()) {
		$('#setName').val('');
	} else {
		$('#setName').val(Session.get('previousName'));
	}
	$('#setNameLabel').removeClass('text-warning');
	$('#helpSetName').html('');

	if (isNewCardset()) {
		$('#setCardType').html(CardType.getCardTypeLongName(-1));
		$('#setCardType').val(-1);
	} else {
		$('#setCardType').html(CardType.getCardTypeLongName(Session.get('previousCardType')));
		$('#setCardType').val(Session.get('previousCardType'));
		if (Session.get('previousCardType') !== -1) {
			Session.set('cardType', Session.get('previousCardType'));
		}
	}

	$('#setCardTypeLabel').removeClass('text-warning');

	if (Route.isShuffle()) {
		$('#contentEditor').val(Session.get("ShuffleTemplate").description);
	} else if (isNewCardset()) {
		$('#contentEditor').val('');
	} else {
		$('#contentEditor').val(Session.get('previousDescription'));
	}
	$('#setDescriptionLabel').removeClass('text-warning');
	$('#helpSetDescription').html('');

	$('#setModuleLabel').removeClass('text-warning');
	$('#helpSetModule').html('');

	$('#setModuleShortLabel').removeClass('text-warning');
	$('#helpSetModuleShort').html('');

	$('#setModuleNumLabel').removeClass('text-warning');
	$('#helpSetModuleNum').html('');

	$('#setCollegeLabel').removeClass('text-warning');
	$('#helpSetCollege').html('');

	$('#setCourseLabel').removeClass('text-warning');
	$('#helpSetCourse').html('');

	if (isNewCardset()) {
		Session.set('cardType', Number(0));
	}

	adjustDifficultyColor();
	$('#contentEditor').css('height', 'unset');
}

export function saveCardset() {
	let bertDelay = 10000;
	let bertDelayMultiplier = 0;
	let error = false;
	let errorMessage = "<ul>";
	if ($('#setName').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.name') + "</li>";
		bertDelayMultiplier++;
		$('#setNameLabel').addClass('text-warning');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
	}
	if ($('#setCardType').val() < 0) {
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.cardType') + "</li>";
		bertDelayMultiplier++;
		$('#setCardTypeLabel').addClass('text-warning');
		$('#helpSetCardType').html(TAPi18n.__('modal-dialog.cardType_required'));
	}
	if ($('#contentEditor').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.description') + "</li>";
		bertDelayMultiplier++;
		$('#setDescriptionLabel').addClass('text-warning');
		$('#helpSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
	}
	errorMessage += "</ul>";
	Bert.defaults.hideDelay = bertDelay * bertDelayMultiplier;
	BertAlertVisuals.displayBertAlert(errorMessage, 'warning', 'growl-top-left');
	if (!error) {
		let name, cardType, description, shuffled, cardGroups;
		name = $('#setName').val();
		if (Route.isShuffle()) {
			cardType = -1;
		} else {
			cardType = $('#setCardType').val();
		}
		description = $('#contentEditor').val();
		if (isNewCardset()) {
			if (Route.isShuffle()) {
				shuffled = true;
				cardGroups = Session.get("ShuffledCardsets");
			} else {
				shuffled = false;
				cardGroups = [];
			}
			Meteor.call("addCardset", name, description, false, true, 'personal', shuffled, cardGroups, Number(cardType), Session.get('difficultyColor'), function (error, result) {
				$('#setCardsetFormModal').modal('hide');
				if (result) {
					if (Session.get('importCards') !== undefined) {
						Meteor.call('importCards', Session.get('importCards'), result, 0);
						Session.set('importCards', undefined);
					}
					$('#setCardsetFormModal').on('hidden.bs.modal', function () {
						Router.go('cardsetdetailsid', {
							_id: result
						});
					});
				}
			});
			return true;
		} else {
			if (Cardsets.findOne(Router.current().params._id).shuffled) {
				cardType = -1;
			}
			Meteor.call("updateCardset", Router.current().params._id, name, description, Number(cardType), Session.get('difficultyColor'));
			if (Number(cardType) !== -1) {
				Session.set('cardType', Number(cardType));
			}
			$('#setCardsetFormModal').modal('hide');
			return true;
		}
	} else {
		BertAlertVisuals.displayBertAlert(errorMessage, 'danger', 'growl-top-left', TAPi18n.__('modal-dialog.missingFields'));
	}
}

/*
 * ############################################################################
 * cardsetForm
 * ############################################################################
 */

Template.cardsetForm.helpers({
	isShuffleRoute: function () {
		return Route.isShuffle();
	},
	isNew: function () {
		return isNewCardset();
	}
});

/*
 * ############################################################################
 * cardsetFormContent
 * ############################################################################
 */

Template.cardsetFormContent.onRendered(function () {
	$('#setCardsetFormModal').on('show.bs.modal', function () {
		if (!Route.isShuffle()) {
			cleanModal();
		}
	});
	$('#setCardsetFormModal').on('hidden.bs.modal', function () {
		if (!Route.isShuffle()) {
			cleanModal();
		}
		$('#importCardset').val('');
		Session.set('importCards', undefined);
	});
});

Template.cardsetFormContent.helpers({
	isNew: function () {
		return isNewCardset();
	},
	getCardTypeName: function (cardType) {
		return CardType.getCardTypeName(cardType);
	},
	getShuffleName: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").name : "";
		}
	},
	learningActive: function () {
		if (Route.isCardset()) {
			return Cardsets.findOne({_id: Router.current().params._id}).learningActive;
		} else {
			return false;
		}
	},
	gotDifficultyLevel: function () {
		return CardType.gotDifficultyLevel(Session.get('cardType'));
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(Session.get('cardType'));
	}
});

Template.cardsetFormContent.events({
	'click #cardSetSave': function () {
		saveCardset();
	},
	'click .cardType': function (evt) {
		let cardType = $(evt.currentTarget).attr("data");
		$('#setCardType').html($(evt.currentTarget).text());
		$('#setCardType').val(cardType);
		Session.set('cardType', Number(cardType));
		adjustDifficultyColor();
		$('#setCardTypeLabel').removeClass('text-warning');
		$('#helpSetCardType').html('');
	},
	'keyup #setName': function () {
		$('#setNameLabel').removeClass('text-warning');
		$('#helpSetName').html('');
	},
	'keyup #contentEditor': function () {
		$('#setDescriptionLabel').removeClass('text-warning');
		$('#helpSetDescription').html('');
	}
});

/*
 * ############################################################################
 * difficultyEditor
 * ############################################################################
 */

Template.difficultyEditor.helpers({
	isDifficultyChecked: function (difficulty) {
		return difficulty === Session.get('difficultyColor');
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(Session.get('cardType'));
	}
});

Template.difficultyEditor.events({
	'click #difficultyGroup': function (event) {
		Session.set('difficultyColor', Number($(event.target).data('color')));
	}
});
