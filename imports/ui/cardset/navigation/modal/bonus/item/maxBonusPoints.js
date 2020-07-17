import "./maxBonusPoints.html";
import {BonusForm} from "../../../../../../util/bonusForm";

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
