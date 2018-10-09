import "./leitnerHelp.html";
import "./content/english.html";
import "./content/german.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
let firstTimeLeitner = 'isFirstTimeLeitner';

/*
 * ############################################################################
 * leitnerHelpModal
 * ############################################################################
 */

Template.leitnerHelpModal.onRendered(function () {
	$('#leitnerHelpModal').on('show.bs.modal', function () {
		Session.set('helpModalActive', true);
	});
	$('#leitnerHelpModal').on('hidden.bs.modal', function () {
		Session.set('helpModalActive', false);
	});
	if (localStorage.getItem(firstTimeLeitner) !== "true") {
		$('#leitnerHelpModal').modal('show');
	}
});

Template.leitnerHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	Session.set('helpModalActive', false);
});


Template.leitnerHelpModal.events({
	"click #leitnerHelpConfirm": function () {
		$('#leitnerHelpModal').modal('hide');
		localStorage.setItem(firstTimeLeitner, "true");
	}
});
