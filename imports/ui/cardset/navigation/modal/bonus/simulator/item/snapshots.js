import "./snapshots.html";
import {Session} from "meteor/session";
import {LeitnerProgress} from "../../../../../../../util/leitnerProgress";
import {LeitnerSimulator} from "../../../../../../../util/leitnerSimulator";

/*
 * ############################################################################
 * bonusFormSimulatorSnapshots
 * ############################################################################
 */

Session.setDefault('activeSimulatorSnapshotDate', 0);

Template.bonusFormSimulatorSnapshots.helpers({
	getSnapshots: function () {
		return LeitnerSimulator.getSnapshotDates();
	},
	isActive: function (index) {
		if (Session.get('activeSimulatorSnapshotDate') === index) {
			return true;
		}
	}
});

Template.bonusFormSimulatorSnapshots.events({
	'click .snapshot-date': function (event) {
		Session.set('activeSimulatorSnapshotDate', $(event.target).data('id'));
		LeitnerProgress.updateGraph();
	}
});
