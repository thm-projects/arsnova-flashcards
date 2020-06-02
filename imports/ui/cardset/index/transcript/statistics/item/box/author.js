import "./author.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxAuthor
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxAuthor.events({
	'click .info-box-author': function (event) {
		event.preventDefault();
		FlowRouter.go('admin_user', {
			_id: $(event.target).data('id')
		});
	}
});
