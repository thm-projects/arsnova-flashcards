import {Session} from "meteor/session";
import "./arsnovaClick.html";
import {fullscreenModal} from "../../../api/fullscreenModal";
import * as config from "../../../config/arsnovaClick.js";

/*
 * ############################################################################
 * mainModalArsnovaClick
 * ############################################################################
 */

Template.mainModalArsnovaClick.onRendered(function () {
	$('#arsnovaClickModal').on('hidden.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_v2.png');
		$('.showArsnovaClick').removeClass('pressed');
		$('#arsnovaClickModal .modal-dialog').html('');
	});
	$('#arsnovaClickModal').on('shown.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_pressed.png');
		$('.showArsnovaClick').addClass('pressed');
		if (!Session.get('arsnovaClickModalActive')) {
			Session.set('arsnovaClickModalActive', true);
			$('#arsnovaClickModal .modal-dialog').html(`<iframe id="arsnovaClick" width="600px" height="900px" frameborder="0" src="${config.sessionURL}"></iframe>`);
			fullscreenModal.resizeIframe("modalContainerClick");
			fullscreenModal.resizeIframe("arsnovaClick");
		}
	});
});
