//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {updateNavigation} from "../card/card";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Session.set('animationPlaying', false);


/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onRendered(function () {
	updateNavigation();
});

/*
 * ############################################################################
 * endPresentationModal
 * ############################################################################
 */

Template.endPresentationModal.events({
	"click #endPresentationConfirm": function () {
		$('#endPresentationModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#endPresentationModal').on('hidden.bs.modal', function () {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		});
	}
});
