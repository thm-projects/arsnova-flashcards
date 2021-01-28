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
		return TAPi18n.__('panel-body-experience.day', {count: this.daysBeforeReset});
	}
});
