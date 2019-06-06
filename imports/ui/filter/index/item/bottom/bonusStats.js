import "./bonusStats.html";
import {Template} from "meteor/templating";


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
		Router.go('transcriptBonus', {
			_id: $(event.target).data('id')
		});
	}
});
