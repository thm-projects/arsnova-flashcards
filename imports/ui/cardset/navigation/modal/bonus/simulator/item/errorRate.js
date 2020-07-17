import "./errorRate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";

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
