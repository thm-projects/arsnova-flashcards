import "./errorRate.html";
import {BonusForm} from "../../../../../../../util/bonusForm";

/*
 * ############################################################################
 * bonusFormSimulatorErrorRate
 * ############################################################################
 */

Template.bonusFormSimulatorErrorRate.helpers({
	getCardCount: function () {
		return BonusForm.getCardCount();
	}
});

Template.bonusFormSimulatorErrorRate.events({
	'change input': function () {
		BonusForm.adjustErrorCount();
	}
});
