import "./startDate.html";
import {BonusForm} from "../../../../../../api/bonusForm";

/*
* ############################################################################
* bonusFormStartDate
* ############################################################################
*/

Template.bonusFormStartDate.events({
	"input #dateBonusStart": function () {
		BonusForm.adjustRegistrationPeriod();
	}
});
