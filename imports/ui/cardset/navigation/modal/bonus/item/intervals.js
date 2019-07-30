import "./intervals.html";
import {BonusForm} from "../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../api/leitnerProgress";

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval();
		BonusForm.initializeSimulatorData();
		LeitnerProgress.updateGraph();
	}
});
