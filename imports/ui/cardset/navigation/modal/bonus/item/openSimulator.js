import "./openSimulator.html";
import {LeitnerSimulator} from "../../../../../../util/leitnerSimulator";
import {Session} from "meteor/session";

/*
* ############################################################################
* bonusFormOpenSimulator
* ############################################################################
*/

Template.bonusFormOpenSimulator.events({
	"click #openSimulatorModal": function () {
		Session.set('activeSimulatorSnapshotDate', 0);
		LeitnerSimulator.createSnapshotDates();
		LeitnerSimulator.updateSimulator();
	}
});
