//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./deleteProfile.html";

/*
 * ############################################################################
 * profileDeleteConfirmForm
 * ############################################################################
 */

Template.profileDeleteConfirmForm.events({
	'click #profileDelete': function () {
		$('#profileDelteConfirmModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteUserProfile");
			document.location.reload(true);
		}).modal('hide');
	}
});
