import "./daysBeforeReset.html";
import {BonusForm} from "../../../../../../util/bonusForm";

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
