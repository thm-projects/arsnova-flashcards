//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./leitnerSimulator.html";

/*
 * ############################################################################
 * cardsetLeitnerSimulatorForm
 * ############################################################################
 */

Template.cardsetLeitnerSimulatorForm.onRendered(function () {
	$('#cardsetLeitnerSimulatorModal').on('hidden.bs.modal', function () {
		$('body').addClass('modal-open');
		$('.modal-backdrop').add();
	});
});
