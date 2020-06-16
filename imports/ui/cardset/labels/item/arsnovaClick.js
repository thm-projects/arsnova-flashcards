import {Session} from "meteor/session";
import './arsnovaClick.html';

Template.cardsetLabelsItemArsnovaClick.events({
	'click .label-arsnova-click': function () {
		if (this.isModalLabel === undefined || this.isModalLabel === false) {
			Session.set('arsnovaClickSessionID', this.arsnovaClick.session);
			$('#arsnovaClickModal').modal('show');
		}
	}
});
