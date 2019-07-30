import "./resetErrorRate.html";
import {BonusForm} from "../../../../../../../api/bonusForm";

/*
 * ############################################################################
 * bonusFormSimulatorResetErrorRate
 * ############################################################################
 */

Template.bonusFormSimulatorResetErrorRate.events({
	'click #resetErrorRate': function () {
		BonusForm.resetErrorCount();
	}
});
