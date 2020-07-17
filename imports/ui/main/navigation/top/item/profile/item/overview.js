import "./overview.html";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";

Template.mainNavigationTopItemProfileItemOverview.events({
	'click .profile-overview': function () {
		LeitnerProgress.setupTempData('', '', 'user');
		$('#progressModal').modal('show');
	}
});
