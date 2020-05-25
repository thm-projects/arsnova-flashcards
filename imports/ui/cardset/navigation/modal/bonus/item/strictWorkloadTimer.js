import "./strictWorkloadTimer.html";
import {BonusForm} from "../../../../../../api/bonusForm";

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
