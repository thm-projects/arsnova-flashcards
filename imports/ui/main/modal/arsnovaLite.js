import {Session} from "meteor/session";
import "./arsnovaLite.html";

/*
 * ############################################################################
 * mainModalArsnovaLite
 * ############################################################################
 */

Template.mainModalArsnovaLite.onRendered(function () {
	$('#arsnovaLiteModal').on('hidden.bs.modal', function () {
		$('.showArsnovaLite').removeClass('pressed');
	});
	$('#arsnovaLiteModal').on('shown.bs.modal', function () {
		$('.showArsnovaLite').addClass('pressed');
		if (!Session.get('arsnovaLiteModalActive')) {
			Session.set('arsnovaLiteModalActive', true);
			$('#arsnovaLiteModal .modal-dialog').html('<iframe id="arsnovaLite" width="600px" height="900px" frameborder="0" src="https://beta.arsnova.eu"></iframe>');
		}
	});
});
