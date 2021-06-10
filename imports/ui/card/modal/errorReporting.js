import "./errorReporting.html";
import {Meteor} from "meteor/meteor";
import {Template} from 'meteor/templating';
import swal from "sweetalert2";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../util/cardNavigation";
import {CardType} from "../../../util/cardTypes";
import {ErrorReporting} from "../../../util/errorReporting";
import "./errorReportingTable";

function getCardSide() {
	return parseInt($('input[name="cardSide"]:checked').val());
}

function getErrorTypes() {
	let errorTypes = [];
	if ($('#spellingMistakeCheckbox').prop("checked")) {
		errorTypes.push(0);
	}
	if ($('#missingPictureCheckbox').prop("checked")) {
		errorTypes.push(1);
	}
	if ($('#layoutMistakeCheckbox').prop("checked")) {
		errorTypes.push(2);
	}
	if ($('#brokenLinkCheckbox').prop("checked")) {
		errorTypes.push(3);
	}
	return errorTypes;
}

function getErrorContent() {
	return $('#otherErrorTextarea').val();
}

function getErrorStatus() {
	return parseInt($('input[name="errorStatus"]:checked').val());
}

function checkInput() {
	if (getErrorTypes().length !== 0 || getErrorContent()) {
		return true;
	} else {
		swal.fire({
			title: TAPi18n.__('modal-card.errorReporting.noErrorChecked'),
			html: TAPi18n.__('modal-card.errorReporting.noErrorCheckedText'),
			type: "error",
			allowOutsideClick: false,
			confirmButtonText: "Weiter bearbeiten"
		});
		return false;
	}
}

Template.registerHelper("getErrorReport", () => Session.get("errorReportingCard"));

Template.errorReportingModal.helpers({
	isErrorReviewMode: function () {
		return Session.get('errorReportingMode');
	}
});

Template.errorReportingModal.events({
	'click #sendErrorReport': function () {
		if (checkInput()) {
			$('#showErrorReportingModal').modal('hide');
			$('.errorReporting').removeClass("pressed");
			Meteor.call("sendErrorReport", Meteor.userId(), Session.get('activeCardset')._id,
				Session.get('activeCard'), getCardSide(), getErrorTypes(),
				getErrorContent());
			Meteor.call("getCardCreator", Session.get('activeCard'), (err, result) => {
				swal.fire({
					title: TAPi18n.__('modal-card.errorReporting.thankYou'),
					html:  result + " " + TAPi18n.__('modal-card.errorReporting.informCreator'),
					type: "success",
					allowOutsideClick: false,
					confirmButtonText: "Weiter"
				});
			});
			ErrorReporting.loadErrorReportingModal();
		}
	},
	'click #saveErrorReport': function () {
		if (checkInput()) {
			$('#showErrorReportingModal').modal('hide');
			$('.errorReporting').removeClass("pressed");
			Meteor.call("updateErrorReport", Session.get('activeErrorReport'), Session.get('activeCardset')._id,
				Session.get('activeCard'), getCardSide(), getErrorTypes(),
				getErrorContent());
			swal.fire({
				title: TAPi18n.__('modal-card.errorReporting.thankYou'),
				html: TAPi18n.__('modal-card.errorReporting.thankYouText'),
				type: "success",
				allowOutsideClick: false,
				confirmButtonText: "Weiter"
			});
		}
	},
	'click #closeErrorReport': function () {
		if (checkInput()) {
			$('#showErrorReportingModal').modal('hide');
			$('.errorReporting').removeClass("pressed");
			Meteor.call("updateErrorReportStatus", Session.get('activeErrorReport'), Session.get('activeCardset')._id,
				Session.get('activeCard'), getErrorStatus());
			Meteor.call("getCardErrors", Session.get('activeCard'), function (err, res) {
				if (!err) {
					Session.set('errorReportingCard', res);
				}
			});
		}
	}
});

Template.setCardSideForError.events({
	'click #cardsetButton': function () {
		$('#cardSidesGroup').addClass('hidden');
	},
	'click #cardButton': function () {
		$('#cardSidesGroup').addClass('hidden');
	},
	'click #cardSideButton': function () {
		$('#cardSidesGroup').removeClass('hidden');
	}
});

Template.setCardSideForError.helpers({
	isCardSideButtonActive: function () {
		return $('#cardSideButton').hasClass('active');
	},
	getCardNavigation: function () {
		return CardNavigation.indexNavigation(CardType.getCardTypeCubeSides(Session.get('cardType')));
	},
	getTitle: function () {
		if (CardType.gotCardsetTitleNavigation(Session.get('cardType'))) {
			return Session.get('activeCardsetName');
		} else {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.content' + this.contentId);
		}
	},
	isCardSideChecked: function (cardSideButton) {
		return $(cardSideButton).hasClass('active');
	}
});

Template.changeErrorStatus.helpers({
	isErrorReportingMode: function () {
		return Session.get('errorReportingMode');
	}
});
