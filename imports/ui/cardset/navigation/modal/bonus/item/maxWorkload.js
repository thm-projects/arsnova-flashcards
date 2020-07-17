import "./maxWorkload.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LeitnerProgress} from "../../../../../../util/leitnerProgress";

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
