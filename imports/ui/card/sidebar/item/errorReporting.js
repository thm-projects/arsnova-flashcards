import "./errorReporting.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {ErrorReporting} from "../../../../util/errorReporting";

Template.cardSidebarItemErrorReporting.onRendered(function () {
	$('#showErrorReportingModal').on('hidden.bs.modal', function () {
		$('.errorReporting').removeClass("pressed");
	}).modal('hide');
	ErrorReporting.loadErrorReportingModal();
});

Template.cardSidebarItemErrorReporting.events({
	"click .errorReporting": function () {
		$('.errorReporting').addClass("pressed");
		Session.set('errorReportingMode', false);
		ErrorReporting.adjustActiveCardSide();
		$('#showErrorReportingModal').modal('show');
	}
});
