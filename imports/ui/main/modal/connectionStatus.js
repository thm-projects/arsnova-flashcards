import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./connectionStatus.html";

/*
* ############################################################################
* mainModalConnectionStatus
* ############################################################################
*/

Template.mainModalConnectionStatus.onRendered(function () {
	$('#connectionStatusModal').on('hidden.bs.modal', function () {
		Session.set('isConnectionModalOpen', false);
	});
	$('#connectionStatusModal').on('shown.bs.modal', function () {
		Session.set('isConnectionModalOpen', true);
	});
});
