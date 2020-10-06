import "./intervals.html";
import {BonusForm} from "../../../../../../../util/bonusForm";

/*
* ############################################################################
* bonusFormSimulatorIntervals
* ############################################################################
*/

Template.bonusFormSimulatorIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval(true);
	}
});
