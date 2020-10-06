//------------------------ IMPORTS
import "./item/addChanges.js";
import "./item/calculate.js";
import "./item/cancel.js";
import "./item/errorRate.js";
import "./item/resetErrorRate.js";
import "./item/maxWorkload.js";
import "./item/snapshots.js";
import "./item/intervals.js";
import "./item/update.js";
import "./item/progress.js";
import {Template} from "meteor/templating";
import "./leitnerSimulator.html";
import {LeitnerProgress} from "../../../../../../util/leitnerProgress";

/*
 * ############################################################################
 * cardsetLeitnerSimulatorForm
 * ############################################################################
 */

Template.cardsetLeitnerSimulatorForm.onRendered(function () {
	$('#cardsetLeitnerSimulatorModal').on('hidden.bs.modal', function () {
		LeitnerProgress.clearTempData();
		$('body').addClass('modal-open');
		$('.modal-backdrop').add();
	});
});
