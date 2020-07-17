import "./workloadProgress.html";
import {Template} from "meteor/templating";
import {LeitnerProgress} from "../../../../../../util/leitnerProgress";

Template.filterIndexItemBottomWorkloadProgress.events({
	'click .resultNavigationElement': function (event) {
		LeitnerProgress.setupTempData($(event.currentTarget).data('cardset'), ($(event.currentTarget).data('user')), 'cardset');
		$('#progressModal').modal('show');
	}
});
