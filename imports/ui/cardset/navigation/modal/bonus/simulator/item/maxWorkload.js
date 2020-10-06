import "./maxWorkload.html";
import {BonusForm} from "../../../../../../../util/bonusForm";

/*
* ############################################################################
* bonusFormSimulatorMaxWorkload
* ############################################################################
*/

Template.bonusFormSimulatorMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
	}
});
