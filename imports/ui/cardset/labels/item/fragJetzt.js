import {Session} from "meteor/session";
import './fragJetzt.html';

Template.cardsetLabelsItemFragJetzt.events({
	'click .label-frag-jetzt': function () {
		if (this.isModalLabel === undefined || this.isModalLabel === false) {
			Session.set('fragJetztSessionID', this.fragJetzt.session);
			$('#arsnovaLiteModal').modal('show');
		}
	}
});
