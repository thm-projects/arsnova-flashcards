import "./maxWorkload.html";
import {BonusForm} from "../../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../../api/leitnerProgress";

/*
* ############################################################################
* bonusFormSimulatorMaxWorkload
* ############################################################################
*/

Template.bonusFormSimulatorMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
		BonusForm.initializeSimulatorData();
		LeitnerProgress.updateGraph();
	}
});
