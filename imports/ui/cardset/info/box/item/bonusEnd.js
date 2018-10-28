//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusEnd.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusEnd
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusEnd.helpers({
	getDateEnd: function () {
		return moment(this.learningEnd).format("DD.MM.YYYY");
	}
});
