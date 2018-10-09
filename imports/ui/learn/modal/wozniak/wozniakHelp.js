import "./wozniakHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
let firstTimeWozniak = 'isFirstTimeWozniak';

/*
 * ############################################################################
 * wozniakHelpModal
 * ############################################################################
 */

Template.wozniakHelpModal.onRendered(function () {
	$('#wozniakHelpModal').on('show.bs.modal', function () {
		Session.set('helpModalActive', true);
	});
	$('#wozniakHelpModal').on('hidden.bs.modal', function () {
		Session.set('helpModalActive', false);
	});
	if (localStorage.getItem(firstTimeWozniak) !== "true") {
		$('#wozniakHelpModal').modal('show');
	}
});

Template.wozniakHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	Session.set('helpModalActive', false);
});


Template.wozniakHelpModal.events({
	"click #wozniakHelpConfirm": function () {
		$('#wozniakHelpModal').modal('hide');
		localStorage.setItem(firstTimeWozniak, "true");
	}
});
