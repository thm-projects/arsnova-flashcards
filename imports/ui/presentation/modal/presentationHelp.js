import "./presentationHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
let firstTimePresentation = 'isFirstTimePresentation';

/*
 * ############################################################################
 * presentationHelpModal
 * ############################################################################
 */

Template.presentationHelpModal.onRendered(function () {
	$('#presentationHelpModal').on('show.bs.modal', function () {
		Session.set('helpModalActive', true);
	});
	$('#presentationHelpModal').on('hidden.bs.modal', function () {
		Session.set('helpModalActive', false);
	});
	if (localStorage.getItem(firstTimePresentation) !== "true") {
		$('#presentationHelpModal').modal('show');
	}
});

Template.presentationHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	Session.set('helpModalActive', false);
});


Template.presentationHelpModal.events({
	"click #presentationHelpConfirm": function () {
		$('#presentationHelpModal').modal('hide');
		localStorage.setItem(firstTimePresentation, "true");
	}
});
