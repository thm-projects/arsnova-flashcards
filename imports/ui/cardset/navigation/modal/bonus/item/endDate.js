import "./endDate.html";
import {BonusForm} from "../../../../../../util/bonusForm";

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
