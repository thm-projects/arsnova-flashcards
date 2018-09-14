import "./presentationHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
let firstTimePresentation = 'isFirstTimePresentation';

/*
 * ############################################################################
 * presentationHelpModal
 * ############################################################################
 */

Template.presentationHelpModal.onRendered(function () {
	if (localStorage.getItem(firstTimePresentation) !== "true") {
		$('#presentationHelpModal').modal('show');
	}
});

Template.presentationHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
});


Template.presentationHelpModal.events({
	"click #presentationHelpConfirm": function () {
		$('#presentationHelpModal').modal('hide');
		localStorage.setItem(firstTimePresentation, "true");
	}
});
