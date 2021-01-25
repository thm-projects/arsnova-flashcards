import "./calculate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../../util/learningStatus";

/*
 * ############################################################################
 * bonusFormSimulatorCalculate
 * ############################################################################
 */

Template.bonusFormSimulatorCalculate.events({
	'click .calculateWorkload': function () {
		BonusForm.adjustErrorCount();
		BonusForm.calculateWorkload(BonusForm.getMaxWorkload());
		LearningStatus.updateGraph();
	}
});
