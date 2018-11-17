import "./arsnovaApp.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('arsnovaAppModalActive', false);

/*
 * ############################################################################
 * cardSidebarItemArsnovaApp
 * ############################################################################
 */

Template.cardSidebarItemArsnovaApp.events({
	"click .showArsnovaApp": function () {
		$('#arsnovaAppModal').modal('show');
	}
});

Template.cardSidebarItemArsnovaApp.onCreated(function () {
	Session.set('arsnovaAppModalActive', false);
});

Template.cardSidebarItemArsnovaApp.onDestroyed(function () {
	Session.set('arsnovaAppModalActive', false);
});

/*
 * ############################################################################
 * arsnovaAppModal
 * ############################################################################
 */

Template.arsnovaAppModal.onRendered(function () {
	$('#arsnovaAppModal').on('hidden.bs.modal', function () {
		$('.showArsnovaApp').attr('src', '/img/button/arsnova_app.png');
		$('.showArsnovaApp').removeClass('pressed');
	});
	$('#arsnovaAppModal').on('shown.bs.modal', function () {
		$('.showArsnovaApp').attr('src', '/img/button/arsnova_app_pressed.png');
		$('.showArsnovaApp').addClass('pressed');
		if (!Session.get('arsnovaAppModalActive')) {
			Session.set('arsnovaAppModalActive', true);
			$('#arsnovaAppModal .modal-dialog').html('<iframe id="arsnovaApp" width="600px" height="800px" frameborder="0" src="https://arsnova.thm.de/mobile/"></iframe>');
		}
	});
});
