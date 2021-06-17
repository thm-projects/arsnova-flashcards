import "./daysBeforeReset.html";
import "../tooltip/de/daysBeforeReset.html";
import "../tooltip/en/daysBeforeReset.html";
import {BonusForm} from "../../../../../../util/bonusForm";
import tippy from "tippy.js";

/*
* ############################################################################
* bonusFormDaysBeforeReset
* ############################################################################
*/

Template.bonusFormDaysBeforeReset.onRendered(function () {
	const template = document.getElementById('bonus-reset-tooltip');

	if (template !== null) {
		tippy('#bonus-reset-info', {
			content: template.innerHTML,
			allowHTML: true
		});
	}
});


Template.bonusFormDaysBeforeReset.events({
	"input #daysBeforeReset": function () {
		BonusForm.adjustDaysBeforeReset();
	}
});
