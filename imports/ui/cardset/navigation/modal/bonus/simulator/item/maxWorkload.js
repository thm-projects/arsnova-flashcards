import "./maxWorkload.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";

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
