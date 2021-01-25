import "./maxWorkload.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../../util/learningStatus";

/*
* ############################################################################
* bonusFormSimulatorMaxWorkload
* ############################################################################
*/

Template.bonusFormSimulatorMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
