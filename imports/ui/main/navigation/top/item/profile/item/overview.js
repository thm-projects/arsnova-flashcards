import "./overview.html";
import {LearningStatus} from "../../../../../../../util/learningStatus";

Template.mainNavigationTopItemProfileItemOverview.events({
	'click .profile-overview': function () {
		LearningStatus.setupTempData('', '', '', 'user');
		$('#learningStatusModal').modal('show');
	}
});
