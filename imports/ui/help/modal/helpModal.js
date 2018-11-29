import "./helpModal.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../../api/route";
import {MainNavigation} from "../../../api/mainNavigation";

/*
 * ############################################################################
 * helpModal
 * ############################################################################
 */

Template.helpModal.onRendered(function () {
	$('#helpModal').on('show.bs.modal', function () {
		Session.set('helpModalActive', true);
	});
	$('#helpModal').on('hidden.bs.modal', function () {
		Session.set('helpModalActive', false);
	});
});

Template.helpModal.onDestroyed(function () {
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
	Session.set('helpModalActive', false);
});


Template.helpModal.events({
	"click #presentationHelpConfirm": function () {
		$('#helpModal').modal('hide');
		if (Route.isPresentation()) {
			localStorage.setItem(MainNavigation.getFirstTimePresentationString(), "true");
		}
	},
	"click #leitnerHelpConfirm": function () {
		$('#helpModal').modal('hide');
		localStorage.setItem(MainNavigation.getFirstTimeLeitnerString(), "true");
	},
	"click #wozniakHelpConfirm": function () {
		$('#helpModal').modal('hide');
		localStorage.setItem(MainNavigation.getFirstTimeWozniakString(), "true");
	}
});
