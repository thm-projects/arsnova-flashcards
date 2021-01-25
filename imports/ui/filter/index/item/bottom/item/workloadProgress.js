import "./workloadProgress.html";
import {Template} from "meteor/templating";
import {LearningStatus} from "../../../../../../util/learningStatus";

Template.filterIndexItemBottomLearningStatus.events({
	'click .showLearningStatus': function (event) {
		LearningStatus.setupTempData($(event.currentTarget).data('cardset'), ($(event.currentTarget).data('user')), 'cardset');
		$('#learningStatusModal').modal('show');
	}
});
