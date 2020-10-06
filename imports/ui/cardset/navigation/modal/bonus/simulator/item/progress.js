import "./progress.html";
import {LeitnerSimulator} from "../../../../../../../util/leitnerSimulator";

/*
 * ############################################################################
 * bonusFormSimulatorProgress
 * ############################################################################
 */

Template.bonusFormSimulatorProgress.helpers({
	isCalculating: function () {
		return LeitnerSimulator.isCalculating();
	},
	currentDay: function () {
		return LeitnerSimulator.getCurrentDay();
	}
});
