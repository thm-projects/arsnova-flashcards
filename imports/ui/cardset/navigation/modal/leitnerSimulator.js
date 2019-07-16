//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./leitnerSimulator.html";
import {BonusForm} from "../../../../api/bonusForm";
import {Session} from "meteor/session";
import {LeitnerProgress} from "../../../../api/leitnerProgress";

/*
 * ############################################################################
 * cardsetLeitnerSimulatorForm
 * ############################################################################
 */

Template.cardsetLeitnerSimulatorForm.onCreated(function () {
	BonusForm.createSnapshotDates();
});

Template.cardsetLeitnerSimulatorForm.onRendered(function () {
	$('#cardsetLeitnerSimulatorModal').on('show.bs.modal', function () {
		Session.set('activeSimulatorSnapshotDate', 0);
		BonusForm.createSnapshotDates();
		LeitnerProgress.updateGraph();
	});
	$('#cardsetLeitnerSimulatorModal').on('hidden.bs.modal', function () {
		$('body').addClass('modal-open');
		$('.modal-backdrop').add();
	});
});
