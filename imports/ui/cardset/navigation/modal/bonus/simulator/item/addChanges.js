import "./addChanges.html";
import {BonusForm} from "../../../../../../../api/bonusForm";

/*
 * ############################################################################
 * bonusFormSimulatorAddChanges
 * ############################################################################
 */

Template.bonusFormSimulatorAddChanges.events({
	'click #addSimulatorChanges': function () {
		BonusForm.addSimulatorChanges();
		$('#cardsetLeitnerSimulatorModal').modal('hide');
	}
});
