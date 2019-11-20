//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Workload} from "../../../api/subscriptions/workload";
import {Filter} from "../../../api/filter";
import "./deleteWorkload.html";

/*
 * ############################################################################
 * cardsetsConfirmLearnForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnForm.events({
	'click #learnDelete': function () {
		$('#bonusFormModal').on('hidden.bs.modal', function () {
			let workload = Workload.findOne({user_id: Meteor.userId(), cardset_id: Session.get('cardsetId')}, {fields: {_id: 1, 'leitner.bonus': 1}});
			if (workload !== undefined && workload.leitner.bonus === true) {
				Meteor.call("leaveBonus", Session.get('cardsetId'), function (error, result) {
					if (result) {
						Filter.updateWorkloadFilter();
					}
				});
			} else {
				Meteor.call("deleteLeitner", Session.get('cardsetId'), function (error, result) {
					if (result) {
						Filter.updateWorkloadFilter();
					}
				});
			}
			Meteor.call("deleteWozniak", Session.get('cardsetId'), function (error, result) {
				if (result) {
					Filter.updateWorkloadFilter();
				}
			});
		}).modal('hide');
	}
});
