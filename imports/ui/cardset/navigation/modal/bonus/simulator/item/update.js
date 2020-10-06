import "./update.html";
import {LeitnerSimulator} from "../../../../../../../util/leitnerSimulator";
/*
 * ############################################################################
 * bonusFormSimulatorUpdate
 * ############################################################################
 */

Template.bonusFormSimulatorCalculate.events({
	'click .updateSimulator': function () {
		LeitnerSimulator.updateSimulator();
	}
});
