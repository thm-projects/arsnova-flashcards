import "./maxBonusPoints.html";
import {BonusForm} from "../../../../../../api/bonusForm";

/*
* ############################################################################
* bonusFormMaxPoints
* ############################################################################
*/

Template.bonusFormMaxPoints.events({
	"input #maxBonusPoints": function () {
		BonusForm.adjustMaxBonusPoints();
	}
});
