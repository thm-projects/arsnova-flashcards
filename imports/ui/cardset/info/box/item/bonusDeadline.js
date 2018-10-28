//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusDeadline.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusDeadline
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusDeadline.helpers({
	getDeadline: function () {
		if (this.daysBeforeReset === 1) {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day');
		} else {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day_plural');
		}
	}
});
