import "./errorReportingTable.html";
import { ErrorReporting } from "../../../util/errorReporting";
import {UserPermissions} from "../../../util/permissions";
import {Template} from 'meteor/templating';
import {Session} from "meteor/session";

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
	hasSide: () => {
		return Session.get('cardType') !== undefined;
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
	},
	getErrorReport: () => Session.get("errorReportingCard")
});
