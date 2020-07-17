import "./intervals.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";

/*
* ############################################################################
* bonusFormSimulatorIntervals
* ############################################################################
*/

Template.bonusFormSimulatorIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval(true);
		BonusForm.initializeSimulatorData();
		LeitnerProgress.updateGraph();
	}
});
