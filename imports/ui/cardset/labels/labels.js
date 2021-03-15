import {LearningStatus} from "../../../util/learningStatus";
import {Template} from "meteor/templating";
import './item/arsnovaClick.js';
import './item/fragJetzt.js';
import './item/license';
import "./labels.html";

/*
* ############################################################################
* cardsetInfo
* ############################################################################
*/

Template.cardsetLabels.helpers({
	getCardsetCardCount: function () {
		if (this.useLeitnerCount) {
			return LearningStatus.getCardsetCardCount(true);
		} else {
			return this.quantity;
		}
	}
});
