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
import {BonusForm} from "../../../../../../util/bonusForm";
import {Session} from "meteor/session";
import {LearningStatus} from "../../../../../../util/learningStatus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

/*
 * ############################################################################
 * cardsetLeitnerSimulatorForm
 * ############################################################################
 */

Template.cardsetLeitnerSimulatorForm.onRendered(function () {
	$('#cardsetLeitnerSimulatorModal').on('show.bs.modal', function () {
		LearningStatus.setupTempData(FlowRouter.getParam('_id'), '', 'simulator');
		Session.set('activeSimulatorSnapshotDate', 0);
		BonusForm.createSnapshotDates();
		BonusForm.initializeSimulatorWorkload();
		LearningStatus.updateGraph();
	});
	$('#cardsetLeitnerSimulatorModal').on('hidden.bs.modal', function () {
		LearningStatus.clearTempData();
		$('body').addClass('modal-open');
		$('.modal-backdrop').add();
	});
});
