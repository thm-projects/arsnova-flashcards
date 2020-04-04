import {Session} from "meteor/session";
import "./arsnovaLite.html";
import {FullscreenModal} from "../../../util/fullscreenModal";
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
		$('#arsnovaLiteModal .modal-dialog').html(`<iframe id="arsnovaLite" width="600px" height="900px" frameborder="0" src="${config.getURL(Session.get('fragJetztSessionID'))}"></iframe>`);
		FullscreenModal.resizeIframe("modalContainerLite");
		FullscreenModal.resizeIframe("arsnovaLite");
	});
});
