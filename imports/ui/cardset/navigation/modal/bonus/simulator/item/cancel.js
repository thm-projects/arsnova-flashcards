import "./cancel.html";

/*
 * ############################################################################
 * bonusFormSimulatorCancel
 * ############################################################################
 */

Template.bonusFormSimulatorCancel.events({
	'click #cancelSimulator': function () {
		$('#cardsetLeitnerSimulatorModal').modal('hide');
	}
});
