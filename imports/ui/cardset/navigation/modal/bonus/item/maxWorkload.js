import "./maxWorkload.html";
import {BonusForm} from "../../../../../../api/bonusForm";
import {LeitnerProgress} from "../../../../../../api/leitnerProgress";

/*
* ############################################################################
* bonusFormMaxWorkload
* ############################################################################
*/

Template.bonusFormMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
		BonusForm.initializeSimulatorData();
		LeitnerProgress.updateGraph();
	}
});
