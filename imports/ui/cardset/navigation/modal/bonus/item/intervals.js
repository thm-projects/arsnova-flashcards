import "./intervals.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../util/learningStatus";

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval();
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
