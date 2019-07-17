import "./calculate.html";
import {BonusForm} from "../../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../../api/leitnerProgress";

/*
 * ############################################################################
 * bonusFormSimulatorCalculate
 * ############################################################################
 */

Template.bonusFormSimulatorCalculate.events({
	'click .calculateWorkload': function () {
		BonusForm.adjustErrorCount();
		BonusForm.calculateWorkload(BonusForm.getMaxWorkload());
		LeitnerProgress.updateGraph();
	}
});
