import {Template} from "meteor/templating";
import "./transcripts.html";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetNavigationTranscripts
 * ############################################################################
 */

Template.cardsetNavigationTranscripts.events({
	"click #transcriptBonus": function () {
		Session.set('transcriptViewingMode', 1);
		Router.go('transcriptBonus', {_id: Router.current().params._id});
	}
});
