import {Template} from "meteor/templating";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
		FlowRouter.go('transcriptBonus', {_id: FlowRouter.getParam('_id')});
	}
});
