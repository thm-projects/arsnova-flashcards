//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardsetVisuals} from "../../../../util/cardsetVisuals";
import "./item/bonusActiveLearners.js";
import "./item/bonusButton.js";
import "./item/bonusDeadline.js";
import "./item/bonusEnd.js";
import "./item/bonusCardMedian.js";
import "./item/bonusCardArithmeticMean.js";
import "./item/bonusCardStandardDeviation.js";
import "./item/bonusMaxPoints.js";
import "./item/BonusMinLearned.js";
import "./item/bonusPointsFAQ.js";
import "./item/bonusNotifications.js";
import "./item/bonusRegistrationPeriod.js";
import "./item/bonusStart.js";
import "./item/bonusStatus.js";
import "./item/bonusWorkload.js";
import "./item/pomodoroBreakTime.js";
import "./item/pomodoroCount.js";
import "./item/pomodoroWorkTime.js";
import "./item/bonusWorkingTimeArithmeticMean.js";
import "./item/bonusWorkingTimeMedian.js";
import "./item/bonusWorkingTimeStandardDeviation.js";
import "./item/bonusWorkingTimeSum.js";
import "./item/bonusTitle.js";
import "./bonus.html";

/*
* ############################################################################
* bonusInfoBox
* ############################################################################
*/


Template.bonusInfoBox.events({
	"click #collapseLearningPhaseInfoButton": function (event) {
		event.preventDefault();
		CardsetVisuals.changeCollapseElement("#collapseLearningPhaseInfo");
	}
});

/*
* ############################################################################
* bonusInfoBoxContent
* ############################################################################
*/

Template.bonusInfoBoxContent.helpers({
	gotBonusTitle: function () {
		return this.title !== undefined && this.title.length;
	}
});
