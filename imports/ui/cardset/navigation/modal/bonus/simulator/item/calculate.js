import "./calculate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";

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
