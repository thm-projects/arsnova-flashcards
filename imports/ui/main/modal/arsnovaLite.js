import {Session} from "meteor/session";
import "./arsnovaLite.html";
import {fullscreenModal} from "../../../api/fullscreenModal";

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
			$('#arsnovaLiteModal .modal-dialog').html(`<iframe id="arsnovaLite" width="600p" height="900px" frameborder="0" src="https://frag.jetzt/participant/room/${Session.get('fragJetztSessionID').replace(/\s/g, "")}/comments"></iframe>`);
			fullscreenModal.resizeIframe("modalContainerLite");
			fullscreenModal.resizeIframe("arsnovaLite");
		}
	});
});
