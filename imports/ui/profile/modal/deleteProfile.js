//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./deleteProfile.html";
import {LeitnerLearningWorkload} from "../../../api/subscriptions/leitner/leitnerLearningWorkload";

/*
 * ############################################################################
 * profileDeleteConfirmForm
 * ############################################################################
 */

Template.profileDeleteConfirmForm.helpers({
	isInBonus: function () {
		return LeitnerLearningWorkload.findOne({isBonus: true, user_id: Meteor.userId()}) !== undefined;
	}
});

Template.profileDeleteConfirmForm.events({
	'click #profileDelete': function () {
		$('#profileDelteConfirmModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteUserProfile");
			document.location.reload(true);
		}).modal('hide');
	}
});
