import "./errorRate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../../util/learningStatus";

/*
 * ############################################################################
 * bonusFormSimulatorErrorRate
 * ############################################################################
 */

Template.bonusFormSimulatorErrorRate.helpers({
	getCardCount: function () {
		return BonusForm.getCardCount();
	}
});

Template.bonusFormSimulatorErrorRate.events({
	'change input': function () {
		BonusForm.adjustErrorCount();
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
