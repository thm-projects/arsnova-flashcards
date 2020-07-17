import "./workloadHistory.html";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";

Template.filterIndexItemBottomWorkloadHistory.events({
	"click .showBonusUserHistory": function (event) {
		let cardset_id = $(event.target).data('id');
		if (cardset_id !== undefined) {
			Meteor.call("getLearningHistoryData", Meteor.userId(), cardset_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for history');
				}
				if (result) {
					Session.set('selectedBonusUserHistoryData', result);
				}
			});
		}
	}
});
