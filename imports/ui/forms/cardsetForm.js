import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetForm.html";
import {CardType} from '../../api/cardTypes.js';
import {Route} from '../../api/route.js';
import {BertAlertVisuals} from "../../api/bertAlertVisuals";
import {Cardsets} from "../../api/cardsets";
import * as config from "../../config/cardset";

export function isNewCardset() {
	return Session.get('isNewCardset');
}

export function cleanModal() {
	if (isNewCardset() && !Route.isShuffle()) {
		let cardset = {
			name: '',
			description: '',
			difficulty: 1,
			cardType: -1
		};
		Session.set('previousCardsetData', cardset);
	}
	if (Route.isCardset()) {
		Session.set('previousCardsetData', Cardsets.findOne(Router.current().params._id));
	}
	if (Route.isShuffle()) {
		$('#setName').val(Session.get("ShuffleTemplate").name);
	} else if (isNewCardset()) {
		$('#setName').val('');
	} else {
		$('#setName').val(Session.get('previousCardsetData').name);
	}
	$('#setNameLabel').removeClass('text-warning');
	$('#helpSetName').html('');

	if (isNewCardset()) {
		let _id = -1;
		if (Session.get('useCaseType') === 1) {
			_id = Session.get('useCaseSelectedCardType');
			Session.set('useCaseType', 0);
		}
		$('.setCardTypeDropdownText').html(CardType.getCardTypeLongName(_id));
		$('.setCardType').val(_id);
	} else {
		$('.setCardTypeDropdownText').html(CardType.getCardTypeLongName(Session.get('previousCardsetData').cardType));
		$('.setCardType').val(Session.get('previousCardsetData').cardType);
		if (Session.get('previousCardsetData').cardType !== -1) {
			Session.set('cardType', Session.get('previousCardsetData').cardType);
		}
		$('#helpSetCardType').html('');
	}

	$('#setCardTypeLabel').removeClass('text-warning');

	if (Route.isShuffle()) {
		$('#contentEditor').val(Session.get("ShuffleTemplate").description);
	} else if (isNewCardset()) {
		$('#contentEditor').val('');
	} else {
		$('#contentEditor').val(Session.get('previousCardsetData').description);
	}
	$('#setDescriptionLabel').removeClass('text-warning');
	$('#helpSetDescription').html('');

	if (isNewCardset()) {
		Session.set('cardType', Number(0));
	}

	if (Session.get('previousCardsetData') !== undefined) {
		Session.set('difficultyColor', Session.get('previousCardsetData').difficulty);
	} else {
		Session.set('difficultyColor', 1);
	}
	$('#contentEditor').css('height', 'unset');
	if (isNewCardset()) {
		if (config.defaultSortTopicContentByDateCreate) {
			$('#sortDate').prop('checked', true);
			$('#sortContent').prop('checked', false);
		} else {
			$('#sortDate').prop('checked', false);
			$('#sortContent').prop('checked', true);
		}
	} else {
		if (Session.get('previousCardsetData').sortType === 0) {
			$('#sortDate').prop('checked', false);
			$('#sortContent').prop('checked', true);
		} else {
			$('#sortDate').prop('checked', true);
			$('#sortContent').prop('checked', false);
		}
	}
}

export function saveCardset() {
	let bertDelay = 10000;
	let bertDelayMultiplier = 0;
	let error = false;
	let errorMessage = "<ul>";
	let sortType = $("input[name='sortType']:checked").val();
	if (sortType === undefined) {
		sortType = 0;
	}
	if ($('#setName').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.name') + "</li>";
		bertDelayMultiplier++;
		$('#setNameLabel').addClass('text-warning');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
	}
	if ($('#setCardsetFormModal .setCardType').val() < 0) {
		error = true;
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
		if (Route.isShuffle() || Route.isRepetitorienFilterIndex()) {
			cardType = -1;
		} else {
			cardType = $('#setCardsetFormModal .setCardType').val();
		}
		description = $('#contentEditor').val();
		if (isNewCardset()) {
			if (Route.isShuffle() || Route.isRepetitorienFilterIndex()) {
				shuffled = true;
				if (Route.isRepetitorienFilterIndex()) {
					cardGroups = [];
				} else {
					cardGroups = Session.get("ShuffledCardsets");
				}
			} else {
				shuffled = false;
				cardGroups = [];
			}
			Meteor.call("addCardset", name, description, false, true, 'personal', shuffled, cardGroups, Number(cardType), Session.get('difficultyColor'), Number(sortType), function (error, result) {
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
			if (Session.get('previousCardsetData').shuffled) {
				cardType = -1;
			}
			Meteor.call("updateCardset", Session.get('previousCardsetData')._id, name, description, Number(cardType), Session.get('difficultyColor'), Number(sortType));
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
	isNew: function () {
		return isNewCardset();
	}
});
/*
 * ############################################################################
 * cardsetFormAdmin
 * ############################################################################
 */
Template.cardsetFormAdmin.onRendered(function () {
	$('#setCardsetFormAdminModal').on('show.bs.modal', function () {
		$('#cardsetChangeOwnerAdminLabel').html("");
	});
	$('#setCardsetFormAdminModal').on('hidden.bs.modal', function () {
		Session.get('activeCardset', undefined);
	});
});

Template.cardsetFormAdmin.helpers({
	isInWordcloud: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').wordcloud;
		}
	},
	getOwnerId: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').owner;
		}
	},
	getCardsetName: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').name;
		}
	},
	getAuthorLabel: function () {
		return TAPi18n.__('modal-dialog.cardsetowner');
	}
});

Template.cardsetFormAdmin.events({
	'click #cardsetChangeOwnerAdmin': function (evt, tmpl) {
		let owner = tmpl.find('#editOwnerAdmin').value;
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('changeOwner', Session.get('activeCardset')._id, owner, function (error, result) {
				if (error || result === false) {
					$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#b94a48'});
					$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('modal-admin-dialog.owner.message.failure', {owner: TAPi18n.__('modal-dialog.cardsetowner')}));
				} else {
					$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#4ab948'});
					$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('modal-admin-dialog.owner.message.success', {owner: TAPi18n.__('modal-dialog.cardsetowner')}));
					Session.set('activeCardset', Cardsets.findOne(Session.get('activeCardset')._id));
				}
			});
		}
	},
	'click #cardsetAddToWordcloude': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateWordcloudStatus', Session.get('activeCardset')._id, true, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	},
	'click #cardsetRemoveFromWordcloude': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateWordcloudStatus', Session.get('activeCardset')._id, false, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	}
});


/*
 * ############################################################################
 * cardsetFormContent
 * ############################################################################
 */

Template.cardsetFormContent.onRendered(function () {
	$('#setCardsetFormModal').on('show.bs.modal', function () {
		cleanModal();
	});
	$('#setCardsetFormModal').on('hidden.bs.modal', function () {
		cleanModal();
		$('#importCardset').val('');
		Session.set('importCards', undefined);
		Session.get('previousCardsetData', undefined);
	});
});

Template.cardsetFormContent.helpers({
	isNew: function () {
		return isNewCardset();
	},
	getShuffleName: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").name : "";
		}
	},
	learningActive: function () {
		if (Route.isCardset() && Session.get("previousCardsetData") !== undefined) {
			return Session.get('previousCardsetData').learningActive;
		} else {
			return false;
		}
	},
	gotDifficultyLevel: function () {
		return CardType.gotDifficultyLevel(Session.get('cardType'));
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(Session.get('cardType'));
	},
	gotTranscriptBonus: function () {
		return CardType.gotTranscriptBonus(Session.get('cardType'));
	}
});

Template.cardsetFormContent.events({
	'click #cardSetSave': function () {
		saveCardset();
	},
	'click .cardType': function (evt) {
		let cardType = $(evt.currentTarget).attr("data");
		$('.setCardTypeDropdownText').html($(evt.currentTarget).text());
		$('.setCardType').val(cardType);
		Session.set('cardType', Number(cardType));
		Session.set('difficultyColor', Session.get('previousCardsetData').difficulty);
		$('.setCardTypeLabel').removeClass('text-warning');
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
