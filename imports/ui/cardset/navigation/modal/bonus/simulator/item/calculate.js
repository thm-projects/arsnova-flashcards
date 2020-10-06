import "./calculate.html";
import {LeitnerSimulator} from "../../../../../../../util/leitnerSimulator";

/*
 * ############################################################################
 * bonusFormSimulatorCalculate
 * ############################################################################
 */

Template.bonusFormSimulatorCalculate.events({
	'click .calculateWorkload': function () {
		LeitnerSimulator.initializeSimulatorData(false);
		LeitnerSimulator.calculateWorkload(LeitnerSimulator.getTempMaxWorkload());
	}
});
