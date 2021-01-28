//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusWorkload.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusWorkload
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusWorkload.helpers({
	getWorkload: function () {
		return TAPi18n.__('confirmLearn-form.card', {count: this.maxCards});
	}
});
