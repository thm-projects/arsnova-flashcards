import "./help.html";
import {Template} from "meteor/templating";
let firstTimeLeitner = 'isFirstTimeLeitner';

/*
 * ############################################################################
 * leitnerHelpModal
 * ############################################################################
 */

Template.leitnerHelpModal.onRendered(function () {
	if (localStorage.getItem(firstTimeLeitner) !== "true") {
		$('#leitnerHelpModal').modal('show');
	}
});

Template.leitnerHelpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
});


Template.leitnerHelpModal.events({
	"click #leitnerHelpConfirm": function () {
		$('#leitnerHelpModal').modal('hide');
		localStorage.setItem(firstTimeLeitner, "true");
	}
});
