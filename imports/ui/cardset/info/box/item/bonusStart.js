//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusStart.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusStart
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusStart.helpers({
	getDateStart: function () {
		return moment(this.start).format("DD.MM.YYYY");
	}
});
