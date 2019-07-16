import "./author.html";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemBoxAuthor
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemBoxAuthor.events({
	'click .info-box-author': function (event) {
		event.preventDefault();
		Router.go('admin_user', {
			_id: $(event.target).data('id')
		});
	}
});
