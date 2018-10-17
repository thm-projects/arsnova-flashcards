import "./demoHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
let firstTimeDemo = 'isFirstTimeDemo';

/*
 * ############################################################################
 * demoHelpModal
 * ############################################################################
 */

Template.demoHelpModal.onRendered(function () {
	$('#presentationHelpModal').on('show.bs.modal', function () {
		Session.set('helpModalActive', true);
	});
	$('#presentationHelpModal').on('hidden.bs.modal', function () {
		Session.set('helpModalActive', false);
	});
	if (localStorage.getItem(firstTimeDemo) !== "true") {
		$('#demoHelpModal').modal('show');
	}
});

Template.demoHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	Session.set('helpModalActive', false);
});


Template.demoHelpModal.events({
	"click #demoHelpConfirm": function () {
		$('#demoHelpModal').modal('hide');
		localStorage.setItem(firstTimeDemo, "true");
	}
});
