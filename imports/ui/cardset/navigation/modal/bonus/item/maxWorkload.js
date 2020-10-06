import "./maxWorkload.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LeitnerSimulator} from "../../../../../../util/leitnerSimulator";

/*
* ############################################################################
* bonusFormMaxWorkload
* ############################################################################
*/

Template.bonusFormMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
		LeitnerSimulator.updateSimulator();
	}
});
