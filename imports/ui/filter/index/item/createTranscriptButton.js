import "./createTranscriptButton.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * filterItemCreateTranscriptButton
 * ############################################################################
 */

Template.filterItemCreateTranscriptButton.events({
	'click #newTranscript': function () {
		FlowRouter.go('newTranscript');
	}
});
