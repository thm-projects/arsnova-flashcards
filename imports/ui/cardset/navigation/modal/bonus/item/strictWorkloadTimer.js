import "./strictWorkloadTimer.html";
import {BonusForm} from "../../../../../../util/bonusForm";

/*
* ############################################################################
* bonusFormStrictWorkloadTimer
* ############################################################################
*/

Template.bonusFormStrictWorkloadTimer.events({
	"input #dateBonusStart": function () {
		BonusForm.adjustRegistrationPeriod();
	}
});
