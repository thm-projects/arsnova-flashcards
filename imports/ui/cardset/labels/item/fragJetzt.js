import {Session} from "meteor/session";
import './fragJetzt.html';

Template.cardsetLabelsItemFragJetzt.events({
	'click .label-frag-jetzt': function () {
		Session.set('fragJetztSessionID', this.fragJetzt.session);
		$('#arsnovaLiteModal').modal('show');
	}
});
