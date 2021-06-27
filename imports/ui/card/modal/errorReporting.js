import "./errorReporting.html";
import {Meteor} from "meteor/meteor";
import {Template} from 'meteor/templating';
import swal from "sweetalert2";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../util/cardNavigation";
import {CardType} from "../../../util/cardTypes";
import {ErrorReporting} from "../../../util/errorReporting";
import {UserPermissions} from "../../../util/permissions";
import {ServerStyle} from "../../../util/styles";

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

Template.errorReportingModal.helpers({
	isErrorReviewMode: function () {
		return Session.get('errorReportingMode');
	},
	getLink: function () {
		return ServerStyle.getGitlabLink();
	}
});


Template.errorReportingModal.events({
	'click #sendErrorReport': function () {
		if (checkInput()) {
			swal.fire({
				title: TAPi18n.__('modal-card.errorReporting.confirmErrorText'),
				showCancelButton: true,
				showConfirmButton: true,
				background: '#2b2b2b',
				width: '70%',
				confirmButtonText: 'Fehler melden',
				cancelButtonText: 'Abbrechen',
				allowOutsideClick: false,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					$('#showErrorReportingModal').modal('hide');
					$('.errorReporting').removeClass("pressed");
					Meteor.call("sendErrorReport", Meteor.userId(), Session.get('activeCardset')._id,
						Session.get('activeCard'), getCardSide(), getErrorTypes(),
						getErrorContent());
					swal.fire({
						title: TAPi18n.__('modal-card.errorReporting.thankYou'),
						html: TAPi18n.__('modal-card.errorReporting.thankYouText'),
						type: "success",
						allowOutsideClick: false,
						confirmButtonText: "Weiter"
					});
					ErrorReporting.loadErrorReportingModal();
				}
			})			
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

Template.overviewErrorReportsModal.onRendered(function () {
	$('#showOverviewErrorReportsModal').on('hidden.bs.modal', function () {
		Session.set('errorReportingMode', false);
		ErrorReporting.loadErrorReportingModal();
	});
});

Template.overviewErrorReportsModal.events({
	'click #closeOverviewErrorReports': function () {
		$('#showOverviewErrorReportsModal').modal('hide');
	}
});

Template.overviewErrorReportsTable.events({
	'click .errorReportEntry': function () {
		if (UserPermissions.canEditCard()) {
			ErrorReporting.loadErrorReportingModal(this);
			$('#showErrorReportingModal').modal('show');
		}
	}
});

Template.overviewErrorReportsTable.helpers({
	getSide: function (cardSide) {
		return TAPi18n.__(`card.cardType${Session.get('cardType')}.content${cardSide + 1}`);
	},
	getErrorReport: function () {
		return Session.get('errorReportingCard');
	},
	getErrors: function (error_id) {
		let errors = '<ul>';
		Session.get('errorReportingCard').forEach(error => {
			if (error._id === error_id) {
				if (error.error.type.includes(0)) {
					errors += `<li>${TAPi18n.__('modal-card.errorReporting.spellingMistake')}</li>`;
				}
				if (error.error.type.includes(1)) {
					errors += `<li>${TAPi18n.__('modal-card.errorReporting.missingPicture')}</li>`;
				}
				if (error.error.type.includes(2)) {
					errors += `<li>${TAPi18n.__('modal-card.errorReporting.layoutMistake')}</li>`;
				}
				if (error.error.type.includes(3)) {
					errors += `<li>${TAPi18n.__('modal-card.errorReporting.brokenLink')}</li>`;
				}
				if (error.error.content.length) {
					errors += `<li>${TAPi18n.__('modal-card.errorReporting.otherError')}:<br>${error.error.content}</li>`;
				}
			}
		});
		return errors += '</ul>';
	},
	getStatus: function (status) {
		if (status === 0) {
			return TAPi18n.__('modal-card.overviewErrorReports.openError');
		} else {
			return TAPi18n.__('modal-card.overviewErrorReports.closedError');
		}
	}
});
