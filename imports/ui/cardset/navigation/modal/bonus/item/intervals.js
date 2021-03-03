import "./intervals.html";
import "../tooltip/de/intervals.html";
import "../tooltip/en/intervals.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../util/learningStatus";
import tippy from "tippy.js";

/*
* ############################################################################
* bonusFormIntervals
* ############################################################################
*/


Template.bonusFormIntervals.onRendered(function () {
	const template = document.getElementById('bonus-intervals-tooltip');

	tippy('#bonus-intervals-info', {
		content: template.innerHTML,
		allowHTML: true
	});
});



Template.bonusFormIntervals.events({
	"change input": function () {
		BonusForm.adjustInterval();
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
