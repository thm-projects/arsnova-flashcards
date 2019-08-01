import "./errorRate.html";
import {BonusForm} from "../../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../../api/leitnerProgress";

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
		LeitnerProgress.updateGraph();
	}
});
