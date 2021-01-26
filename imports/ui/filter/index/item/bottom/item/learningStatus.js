import "./learningStatus.html";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LearningStatus} from "../../../../../../util/learningStatus";

import {Session} from "meteor/session";

Template.filterIndexItemBottomLearningStatus.events({
	'click .showLearningStatus': function (event) {
		LearningStatus.setupTempData($(event.currentTarget).data('cardset'), ($(event.currentTarget).data('user')), 'cardset');
		Meteor.call('getLastLearningStatusActivity', $(event.currentTarget).data('user'), $(event.currentTarget).data('cardset'), false, function (err, res) {
			if (res) {
				Session.set('lastLearningStatusActivity', res);
			}
		});
		$('#learningStatusModal').modal('show');
	}
});
