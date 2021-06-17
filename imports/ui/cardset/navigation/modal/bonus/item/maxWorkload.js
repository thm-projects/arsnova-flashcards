import "./maxWorkload.html";
import "../tooltip/de/maxWorkload.html";
import "../tooltip/en/maxWorkload.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import {LearningStatus} from "../../../../../../util/learningStatus";
import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';

/*
* ############################################################################
* bonusFormMaxWorkload
* ############################################################################
*/

Template.bonusFormMaxWorkload.onRendered(function () {
	const template = document.getElementById('bonus-workload-tooltip');

	if (template !== null) {
		tippy('#bonus-workload-info', {
			content: template.innerHTML,
			allowHTML: true
		});
	}
});

Template.bonusFormMaxWorkload.events({
	"change input": function () {
		BonusForm.adjustMaxWorkload();
		BonusForm.initializeSimulatorData();
		LearningStatus.updateGraph();
	}
});
