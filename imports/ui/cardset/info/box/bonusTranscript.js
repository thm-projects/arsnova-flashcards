//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";
import "./item/bonusActiveLearners.js";
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
import "./bonusTranscript.html";

/*
* ############################################################################
* bonusTranscriptInfoBox
* ############################################################################
*/

Template.bonusTranscriptInfoBox.events({
	"click #collapseBonusTranscriptInfoButton": function (event) {
		event.preventDefault();
		CardsetVisuals.changeCollapseElement("#collapseBonusTranscriptInfo");
	}
});
