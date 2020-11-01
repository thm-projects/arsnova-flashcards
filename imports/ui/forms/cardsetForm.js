import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetForm.html";
import {CardType} from '../../util/cardTypes.js';
import {Route} from '../../util/route.js';
import {BertAlertVisuals} from "../../util/bertAlertVisuals";
import {Cardsets} from "../../api/subscriptions/cardsets";
import * as config from "../../config/cardset";
import "./item/sessions.js";
import {ServerStyle} from "../../util/styles";

export function isNewCardset() {
	return Session.get('isNewCardset');
}

export function setNewCardsetSession(status = false) {
	Session.set('isNewCardset', status);
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
		Session.set('previousCardsetData', Cardsets.findOne(FlowRouter.getParam('_id')));
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
		let _id = -2;
		if (Session.get('useCaseType') === 1) {
			_id = Session.get('useCaseSelectedCardType');
			Session.set('useCaseType', 0);
		}
		if (_id === -1) {
			$('.setCardTypeDropdownText').html(TAPi18n.__("filter-pool.cardType.repetitorium"));
			Session.set('useRepForm', true);
		} else {
			$('.setCardTypeDropdownText').html(CardType.getCardTypeLongName(_id));
			Session.set('useRepForm', false);
		}
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
	if (isNewCardset()) {
		$('#setArsnovaClick').val('');
		$('#setFragJetzt').val('');
	} else {
		$('#setArsnovaClick').val(Session.get('previousCardsetData').arsnovaClick.session);
		$('#setFragJetzt').val(Session.get('previousCardsetData').fragJetzt.session);
	}
	if (isNewCardset() && Route.isRepetitorienFilterIndex()) {
		$('#arsnovaClickOverride').attr('checked', true);
		$('#fragJetztOverride').attr('checked', true);
	} else if (Session.get('previousCardsetData').shuffled) {
		if ($('#arsnovaClickOverride').length && Session.get('previousCardsetData').arsnovaClick !== undefined) {
			$('#arsnovaClickOverride')[0].checked =  Session.get('previousCardsetData').arsnovaClick.overrideOnlyEmptySessions;
		}
		if ($('#fragJetztOverride').length && Session.get('previousCardsetData').fragJetzt !== undefined) {
			$('#fragJetztOverride')[0].checked =  Session.get('previousCardsetData').fragJetzt.overrideOnlyEmptySessions;
		}
	}
}

export function saveCardset() {
	let error = false;
	let errorMessage = "<ul>";
	let sortType = $("input[name='sortType']:checked").val();
	let fragJetzt = {
		session: "",
		overrideOnlyEmptySessions: true
	};
	let arsnovaClick = {
		session: "",
		overrideOnlyEmptySessions: true
	};
	if ($('#setFragJetzt').length) {
		fragJetzt.session = $('#setFragJetzt').val();
	}
	if ($('#setArsnovaClick').length) {
		arsnovaClick.session = $('#setArsnovaClick').val();
	}
	if (Route.isRepetitorienFilterIndex() || (Route.isCardset() && Session.get('previousCardsetData').shuffled)) {
		if ($('#fragJetztOverride').length) {
			fragJetzt.overrideOnlyEmptySessions = $('#fragJetztOverride')[0].checked;
		}
		if ($('#arsnovaClickOverride').length) {
			arsnovaClick.overrideOnlyEmptySessions = $('#arsnovaClickOverride')[0].checked;
		}
	}
	if (sortType === undefined) {
		sortType = 0;
	}
	if ($('#setName').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.name') + "</li>";
		$('#setNameLabel').addClass('text-warning');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
	}
	if ($('#setCardsetFormModal .setCardType').val() < -1) {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.cardType') + "</li>";
		$('#setCardTypeLabel').addClass('text-warning');
		$('#helpSetCardType').html(TAPi18n.__('modal-dialog.cardType_required'));
	}
	if ($('#contentEditor').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.description') + "</li>";
		$('#setDescriptionLabel').addClass('text-warning');
		$('#helpSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
	}
	errorMessage += "</ul>";
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
				if (ServerStyle.gotSimplifiedNav() && Session.get('useRepForm')) {
					shuffled = true;
					cardType = 0;
					cardGroups = [];
				} else {
					shuffled = false;
					cardGroups = [];
				}
			}
			Meteor.call("addCardset", name, description, false, true, 'personal', shuffled, cardGroups, Number(cardType), Session.get('difficultyColor'), Number(sortType), fragJetzt, arsnovaClick, function (error, result) {
				$('#setCardsetFormModal').modal('hide');
				if (result) {
					if (Session.get('importCards') !== undefined) {
						Meteor.call('importCards', Session.get('importCards'), result, 0);
						Session.set('importCards', undefined);
					}
					$('#setCardsetFormModal').on('hidden.bs.modal', function () {
						FlowRouter.go('cardsetdetailsid', {
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
			Meteor.call("updateCardset", Session.get('previousCardsetData')._id, name, description, Number(cardType), Session.get('difficultyColor'), Number(sortType), fragJetzt, arsnovaClick);
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
 * cardsetFormContent
 * ############################################################################
 */

Template.cardsetFormContent.onRendered(function () {
	$('#setCardsetFormModal').on('show.bs.modal', function () {
		cleanModal();
	});
	$('#setCardsetFormModal').on('hidden.bs.modal', function () {
		Session.set('useRepForm', false);
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
			return FlowRouter.getRouteName() === 'shuffle' ? Session.get("ShuffleTemplate").name : "";
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
	},
	isSimplifiedNavRep: function () {
		if (ServerStyle.gotSimplifiedNav() && Route.isMyCardsets()) {
			return Session.get('useRepForm');
		}
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
		if (Number(cardType) === -1) {
			Session.set('useRepForm', true);
		} else {
			Session.set('useRepForm', false);
		}
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
