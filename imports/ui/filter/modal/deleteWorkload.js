//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
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
			Meteor.call("disableLeitner", cardset_id, function (error, result) {
				if (result) {
					if (Route.isFilterIndex()) {
						Filter.updateWorkloadFilter();
					}
				}
			});
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
