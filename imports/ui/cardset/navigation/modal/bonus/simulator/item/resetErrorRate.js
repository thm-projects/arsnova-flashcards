import "./resetErrorRate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";

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
