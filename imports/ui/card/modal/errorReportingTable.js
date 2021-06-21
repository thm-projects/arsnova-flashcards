import "./errorReportingTable.html";
import {ErrorReporting } from "../../../util/errorReporting";
import {UserPermissions} from "../../../util/permissions";
import {Template} from 'meteor/templating';
import {Session} from "meteor/session";
import {ReactiveVar } from "meteor/reactive-var";

const sorting = new ReactiveVar({
	sortCardSideAscending: true,
	sortCardErrorAscending: true,
	sortCardAuthorAscending: true,
	sortCardStatusAscending: true
});

function getErrorMessage(error) {
	let errorMessage = "zzz";
	if(error.error.type) {
		switch(error.error.type[0]){
			case 0: 
				errorMessage = TAPi18n.__('modal-card.errorReporting.spellingMistake')
				break;
			case 1:
				errorMessage = TAPi18n.__('modal-card.errorReporting.missingPicture');
				break;
			case 2:
				errorMessage = TAPi18n.__('modal-card.errorReporting.layoutMistake');
				break;
			case 3:
				errorMessage = TAPi18n.__('modal-card.errorReporting.brokenLink');
				break;
			default:
				errorMessage = TAPi18n.__('modal-card.errorReporting.otherError');
				break;
		}
	}
	return errorMessage;
}

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
	},
	'click #overviewErrorReportsTableSide': () => {
		let elements = Session.get("errorReportingCard");
		const newSorting = sorting.get();
		newSorting.sortCardSideAscending = !newSorting.sortCardSideAscending;
		sorting.set(newSorting);
		Session.set("errorReportingCard", elements.sort((a, b) => {
			if (a.cardSide < b.cardSide) { return newSorting.sortCardSideAscending ? 1 : -1; }
			if (a.cardSide > b.cardSide) { return newSorting.sortCardSideAscending ? -1 : 1; }
			return 0;
		}));
	},
	'click #overviewErrorReportsTableError': () => {
		let elements = Session.get("errorReportingCard");
		const newSorting = sorting.get();
		newSorting.sortCardErrorAscending = !newSorting.sortCardErrorAscending;
		sorting.set(newSorting);
		Session.set("errorReportingCard", elements.sort((a, b) => {
			if (getErrorMessage(b).localeCompare(getErrorMessage(a)) < 0) { return newSorting.sortCardErrorAscending ? 1 : -1; }
			if (getErrorMessage(b).localeCompare(getErrorMessage(a)) > 0) { return newSorting.sortCardErrorAscending ? -1 : 1; }
			return 0;
		}));
	},
	'click #overviewErrorReportsTableAuthor': () => {
		let elements = Session.get("errorReportingCard");
		const newSorting = sorting.get();
		newSorting.sortCardAuthorAscending = !newSorting.sortCardAuthorAscending;
		sorting.set(newSorting);
		Session.set("errorReportingCard", elements.sort((a, b) => {
			if (a.user_id === b.user_id) { return 0; }
			if (a.user_id !== b.user_id) { return -1; }
			return 1;
		}));
	},
	'click #overviewErrorReportsTableStatus': () => {
		let elements = Session.get("errorReportingCard");
		const newSorting = sorting.get();
		newSorting.sortCardStatusAscending = !newSorting.sortCardStatusAscending;
		sorting.set(newSorting);
		Session.set("errorReportingCard", elements.sort((a, b) => {
			if (a.status.toString().localeCompare(b.status.toString()) < 0) { return newSorting.sortCardStatusAscending ? 1 : -1; }
			if (a.status.toString().localeCompare(b.status.toString()) > 0) { return newSorting.sortCardStatusAscending ? -1 : 1; }
			return 0;
		}));
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
	getErrorReport: () => Session.get("errorReportingCard"),
	getSortingArrow: (x) => {
		const newSorting = sorting.get();
		const up = '<i class="fas fa-sort-up"></i>';
		const down = '<i class="fas fa-sort-down"></i>';
		switch (x) {
		case 0: return newSorting.sortCardSideAscending ? up : down;
		case 1: return newSorting.sortCardErrorAscending ? up : down;
		case 2: return newSorting.sortCardAuthorAscending ? up : down;
		case 3: return newSorting.sortCardStatusAscending ? up : down;
		default: return "";}
	}
});
