import "./intervals.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LeitnerSimulator} from "../../../../../../util/leitnerSimulator";

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/

Template.bonusFormIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval();
		LeitnerSimulator.updateSimulator(false);
	}
});
