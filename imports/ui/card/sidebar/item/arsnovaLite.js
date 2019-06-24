import "./arsnovaLite.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('arsnovaLiteModalActive', false);

/*
 * ############################################################################
 * cardSidebarItemArsnovaLite
 * ############################################################################
 */

Template.cardSidebarItemArsnovaLite.events({
	"click .showArsnovaLite": function () {
		$('#arsnovaLiteModal').modal('show');
	}
});

Template.cardSidebarItemArsnovaLite.onCreated(function () {
	Session.set('arsnovaLiteModalActive', false);
});

Template.cardSidebarItemArsnovaLite.onDestroyed(function () {
	Session.set('arsnovaLiteModalActive', false);
});
