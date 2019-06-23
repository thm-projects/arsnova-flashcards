import {Session} from "meteor/session";
import "./arsnovaClick.html";

/*
 * ############################################################################
 * mainModalArsnovaClick
 * ############################################################################
 */

Template.mainModalArsnovaClick.onRendered(function () {
	$('#arsnovaClickModal').on('hidden.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_v2.png');
		$('.showArsnovaClick').removeClass('pressed');
	});
	$('#arsnovaClickModal').on('shown.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_pressed.png');
		$('.showArsnovaClick').addClass('pressed');
		if (!Session.get('arsnovaClickModalActive')) {
			Session.set('arsnovaClickModalActive', true);
			$('#arsnovaClickModal .modal-dialog').html('<iframe id="arsnovaClick" width="600px" height="800px" frameborder="0" src="https://beta.arsnova.eu"></iframe>');
		}
	});
});
