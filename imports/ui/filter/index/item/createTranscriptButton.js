import "./createTranscriptButton.html";

/*
 * ############################################################################
 * filterItemCreateTranscriptButton
 * ############################################################################
 */

Template.filterItemCreateTranscriptButton.events({
	'click #newTranscript': function () {
		Router.go('newTranscript');
	}
});
