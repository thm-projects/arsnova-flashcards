import "./intervals.html";
import {BonusForm} from "../../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../../api/leitnerProgress";

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"input #bonusFormInterval1, input #bonusFormInterval2, input #bonusFormInterval3, input #bonusFormInterval4, input #bonusFormInterval5": function () {
		BonusForm.adjustInterval();
	},
	"change input": function () {
		BonusForm.initializeSimulatorData();
		LeitnerProgress.updateGraph();
	}
});
