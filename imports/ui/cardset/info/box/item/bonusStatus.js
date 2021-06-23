//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusStatus.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusStatus
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusStatus.helpers({
	getLearningStatus: function () {
		if (this.end.getTime() > new Date().getTime()) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	}
});
