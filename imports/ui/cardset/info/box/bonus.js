//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";
import "./item/bonusButton.js";
import "./item/bonusDeadline.js";
import "./item/bonusEnd.js";
import "./item/bonusMaxPoints.js";
import "./item/bonusPointsFAQ.js";
import "./item/bonusRegistrationPeriod.js";
import "./item/bonusStart.js";
import "./item/bonusStatus.js";
import "./item/bonusWorkload.js";
import "./item/pomodoroBreakTime.js";
import "./item/pomodoroCount.js";
import "./item/pomodoroWorkTime.js";
import "./bonus.html";

/*
* ############################################################################
* bonusPhaseInfoBox
* ############################################################################
*/

Template.bonusInfoBox.events({
	"click #collapseLearningPhaseInfoButton": function () {
		CardsetVisuals.changeCollapseIcon("#collapseLearningPhaseInfoIcon");
	}
});
