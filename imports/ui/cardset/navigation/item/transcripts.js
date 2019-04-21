import {Template} from "meteor/templating";
import "./transcripts.html";

/*
 * ############################################################################
 * cardsetNavigationTranscripts
 * ############################################################################
 */

Template.cardsetNavigationTranscripts.events({
	"click #transcriptBonus": function () {
		Router.go('transcriptBonus', {_id: Router.current().params._id});
	}
});
