//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Workload} from "../../../api/subscriptions/workload";
import {Filter} from "../../../util/filter";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import "./deleteWorkload.html";
import {Route} from "../../../util/route";

/*
 * ############################################################################
 * cardsetsConfirmLearnForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnForm.events({
	'click #learnDelete': function () {
		$('#leaveWorkloadModal').on('hidden.bs.modal', function () {
			let cardset_id = Session.get('cardsetId');
			if (Route.isCardset()) {
				cardset_id = FlowRouter.getParam('_id');
			}
			let workload = Workload.findOne({user_id: Meteor.userId(), cardset_id: cardset_id}, {fields: {_id: 1, 'leitner.bonus': 1}});
			if (workload !== undefined && workload.leitner.bonus === true) {
				Meteor.call("leaveBonus", cardset_id, function (error, result) {
					if (result) {
						if (Route.isFilterIndex()) {
							Filter.updateWorkloadFilter();
						}
					}
				});
			} else {
				Meteor.call("deleteLeitner", cardset_id, function (error, result) {
					if (result) {
						if (Route.isFilterIndex()) {
							Filter.updateWorkloadFilter();
						}
					}
				});
			}
			Meteor.call("deleteWozniak", cardset_id, function (error, result) {
				if (result) {
					if (Route.isFilterIndex()) {
						Filter.updateWorkloadFilter();
					}
				}
			});
		}).modal('hide');
	}
});
