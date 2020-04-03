import {Session} from "meteor/session";
import "./arsnovaLite.html";
import {fullscreenModal} from "../../../api/fullscreenModal";
import * as config from "../../../config/fragJetzt.js";

/*
 * ############################################################################
 * mainModalArsnovaLite
 * ############################################################################
 */

Template.mainModalArsnovaLite.onRendered(function () {
	$('#arsnovaLiteModal').on('hidden.bs.modal', function () {
		$('.showArsnovaLite').removeClass('pressed');
		$('#arsnovaLiteModal .modal-dialog').html('');
	});
	$('#arsnovaLiteModal').on('shown.bs.modal', function () {
		$('.showArsnovaLite').addClass('pressed');
		if (!Session.get('arsnovaLiteModalActive')) {
			Session.set('arsnovaLiteModalActive', true);
			$('#arsnovaLiteModal .modal-dialog').html(`<iframe id="arsnovaLite" width="600px" height="900px" frameborder="0" src="${config.sessionURL}"></iframe>`);
			fullscreenModal.resizeIframe("modalContainerLite");
			fullscreenModal.resizeIframe("arsnovaLite");
		}
	});
});
