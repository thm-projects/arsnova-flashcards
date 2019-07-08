import "./bonusStats.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";


/*
 * ############################################################################
 * filterIndexItemBottomBonusStats
 * ############################################################################
 */

Template.filterIndexItemBottomBonusStats.events({
	'click .bonusLeitnerProgress': function (event) {
		Router.go('cardsetstats', {
			_id: $(event.target).data('id')
		});
	},
	'click .bonusTranscriptProgress': function (event) {
		Session.set('transcriptViewingMode', 1);
		Router.go('transcriptBonus', {
			_id: $(event.target).data('id')
		});
	}
});
