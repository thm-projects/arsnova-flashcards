import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./toggle3D.html";

Session.setDefault('enable3D', 1);

/*
 * ############################################################################
 * cardSidebarToggle3D
 * ############################################################################
 */

Template.cardSidebarToggle3D.onCreated(function () {
	Session.set('enable3D', 1);
});

Template.cardSidebarToggle3D.onDestroyed(function () {
	Session.set('enable3D', 1);
});

Template.cardSidebarToggle3D.helpers({
	toggled3D: function () {
		return Session.get('enable3D');
	}
});

Template.cardSidebarToggle3D.events({
	"click .toggle3D": function () {
		if (Session.get('enable3D')) {
			Session.set('enable3D', 0);
		} else {
			Session.set('enable3D', 1);
		}
	}
});
