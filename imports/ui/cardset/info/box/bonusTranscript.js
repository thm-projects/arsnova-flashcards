//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {CardsetVisuals} from "../../../../util/cardsetVisuals";
import "./item/bonusPointsFAQ.js";
import "./item/transcript/bonusMaxPoints.js";
import "./item/transcript/editDeadline.js";
import "./item/transcript/lectureDates.js";
import "./item/transcript/submissionDeadline.js";
import "./item/transcript/lectureEnd.js";
import "./item/transcript/participants.js";
import "./item/transcript/submissions.js";
import "./item/transcript/median.js";
import "./item/transcript/medianPerDate.js";
import "./item/transcript/minimumSubmissions.js";
import "./item/transcript/minimumStars.js";
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
