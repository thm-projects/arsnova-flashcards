import {LeitnerProgress} from "../../../util/leitnerProgress";
import {Template} from "meteor/templating";
import './item/arsnovaClick.js';
import './item/fragJetzt.js';
import "./labels.html";

/*
* ############################################################################
* cardsetInfo
* ############################################################################
*/

Template.cardsetLabels.helpers({
	getCardsetCardCount: function () {
		if (this.useLeitnerCount) {
			return LeitnerProgress.getCardsetCardCount(true);
		} else {
			return this.quantity;
		}
	}
});
