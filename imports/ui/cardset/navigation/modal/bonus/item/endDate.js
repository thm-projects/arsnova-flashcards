import "./endDate.html";
import {BonusForm} from "../../../../../../api/bonusForm";

/*
* ############################################################################
* bonusFormEndDate
* ############################################################################
*/

Template.bonusFormEndDate.events({
	"input #dateBonusEnd": function () {
		BonusForm.adjustRegistrationPeriod();
	}
});
