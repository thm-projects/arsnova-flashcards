import "./arsnovaClick.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('arsnovaClickModalActive', false);

/*
 * ############################################################################
 * cardSidebarItemArsnovaClick
 * ############################################################################
 */

Template.cardSidebarItemArsnovaClick.events({
	"click .showArsnovaClick": function () {
		$('#arsnovaClickModal').modal('show');
	}
});

Template.cardSidebarItemArsnovaClick.onCreated(function () {
	Session.set('arsnovaClickModalActive', false);
});

Template.cardSidebarItemArsnovaClick.onDestroyed(function () {
	Session.set('arsnovaClickModalActive', false);
});

/*
 * ############################################################################
 * arsnovaClickModal
 * ############################################################################
 */

Template.arsnovaClickModal.onRendered(function () {
	$('#arsnovaClickModal').on('hidden.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click.png');
		$('.showArsnovaClick').removeClass('pressed');
	});
	$('#arsnovaClickModal').on('shown.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_pressed.png');
		$('.showArsnovaClick').addClass('pressed');
		if (!Session.get('arsnovaClickModalActive')) {
			Session.set('arsnovaClickModalActive', true);
			$('#arsnovaClickModal .modal-dialog').html('<iframe id="arsnovaClick" width="600px" height="800px" frameborder="0" src="https://arsnova.click"></iframe>');
		}
	});
});
