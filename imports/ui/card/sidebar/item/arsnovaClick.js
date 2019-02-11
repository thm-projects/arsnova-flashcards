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
