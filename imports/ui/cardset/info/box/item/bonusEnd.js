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
		return moment(this.end).format("DD.MM.YYYY");
	}
});
