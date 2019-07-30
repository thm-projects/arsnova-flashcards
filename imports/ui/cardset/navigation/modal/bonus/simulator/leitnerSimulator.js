//------------------------ IMPORTS
import "./item/addChanges.js";
import "./item/calculate.js";
import "./item/cancel.js";
import "./item/errorRate.js";
import "./item/resetErrorRate.js";
import "./item/maxWorkload.js";
import "./item/snapshots.js";
import "./item/intervals.js";
import {Template} from "meteor/templating";
import "./leitnerSimulator.html";
import {BonusForm} from "../../../../../../api/bonusForm";
import {Session} from "meteor/session";
import {LeitnerProgress} from "../../../../../../api/leitnerProgress";

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
		BonusForm.initializeSimulatorWorkload();
		Session.set('activeSimulatorSnapshotDate', 0);
		BonusForm.createSnapshotDates();
		LeitnerProgress.updateGraph();
	});
	$('#cardsetLeitnerSimulatorModal').on('hidden.bs.modal', function () {
		$('body').addClass('modal-open');
		$('.modal-backdrop').add();
	});
});
