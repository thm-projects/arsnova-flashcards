//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {CardNavigation} from "../../api/cardNavigation";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Session.set('animationPlaying', false);


/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onCreated(function () {
	Session.set('activeCard', undefined);
	CardNavigation.toggleVisibility(true);
});

Template.presentationView.onRendered(function () {
	CardNavigation.toggleVisibility(true);
});

Template.presentationView.onDestroyed(function () {
	Session.set('activeCard', undefined);
	Session.set('contrastMode', false);
});

Template.presentationView.events({
	"click #backToPresentation, click #backToPresentationFullscreen": function () {
		if (Router.current().route.getName() === "demolist") {
			Router.go('demo');
		} else {
			Router.go('presentation', {
				_id: Router.current().params._id
			});
		}
	}
});
