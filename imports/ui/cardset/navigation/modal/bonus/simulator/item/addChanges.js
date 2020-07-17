import "./addChanges.html";
import {BonusForm} from "../../../../../../../util/bonusForm";

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
