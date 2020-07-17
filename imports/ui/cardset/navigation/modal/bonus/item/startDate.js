import "./startDate.html";
import {BonusForm} from "../../../../../../util/bonusForm";

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
