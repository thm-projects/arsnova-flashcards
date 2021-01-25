import "./intervals.html";
import {BonusForm} from "../../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../../util/learningStatus";

/*
* ############################################################################
* bonusFormSimulatorIntervals
* ############################################################################
*/

Template.bonusFormSimulatorIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval(true);
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
