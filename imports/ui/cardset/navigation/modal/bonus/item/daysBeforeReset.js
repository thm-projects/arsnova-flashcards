import "./daysBeforeReset.html";
import {BonusForm} from "../../../../../../api/bonusForm";

/*
* ############################################################################
* bonusFormDaysBeforeReset
* ############################################################################
*/

Template.bonusFormDaysBeforeReset.events({
	"input #daysBeforeReset": function () {
		BonusForm.adjustDaysBeforeReset();
	}
});
