import "./intervals.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../util/leitnerProgress";

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
