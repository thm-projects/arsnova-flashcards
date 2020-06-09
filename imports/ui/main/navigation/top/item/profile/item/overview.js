import "./overview.html";
import {LeitnerProgress} from "../../../../../../../api/leitnerProgress";

Template.mainNavigationTopItemProfileItemOverview.events({
	'click .profile-overview': function () {
		LeitnerProgress.setupTempData('', '', 'user');
		$('#progressModal').modal('show');
	}
});
