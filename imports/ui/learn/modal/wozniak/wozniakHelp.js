import "./wozniakHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
let firstTimeWozniak = 'isFirstTimeWozniak';

/*
 * ############################################################################
 * wozniakHelpModal
 * ############################################################################
 */

Template.wozniakHelpModal.onRendered(function () {
	if (localStorage.getItem(firstTimeWozniak) !== "true") {
		$('#wozniakHelpModal').modal('show');
	}
});

Template.wozniakHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
});


Template.wozniakHelpModal.events({
	"click #wozniakHelpConfirm": function () {
		$('#wozniakHelpModal').modal('hide');
		localStorage.setItem(firstTimeWozniak, "true");
	}
});
