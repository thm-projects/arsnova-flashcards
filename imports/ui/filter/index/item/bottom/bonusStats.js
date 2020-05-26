import "./bonusStats.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * filterIndexItemBottomBonusStats
 * ############################################################################
 */

Template.filterIndexItemBottomBonusStats.events({
	'click .bonusLeitnerProgress': function (event) {
		FlowRouter.go('cardsetstats', {
			_id: $(event.target).data('id')
		});
	},
	'click .bonusTranscriptProgress': function (event) {
		Session.set('transcriptViewingMode', 1);
		FlowRouter.go('transcriptBonus', {
			_id: $(event.target).data('id')
		});
	}
});
