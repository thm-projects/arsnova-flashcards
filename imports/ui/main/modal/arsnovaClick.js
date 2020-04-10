import {Session} from "meteor/session";
import "./arsnovaClick.html";
import {FullscreenModal} from "../../../util/fullscreenModal";
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
		$('#arsnovaClickModal .modal-dialog').html(`<iframe id="arsnovaClick" width="600px" height="900px" frameborder="0" src="${config.getURL(Session.get('arsnovaClickSessionID'))}"></iframe>`);
		FullscreenModal.resizeIframe("modalContainerClick");
		FullscreenModal.resizeIframe("arsnovaClick");
	});
});
