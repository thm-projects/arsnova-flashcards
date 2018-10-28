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
		if (this.maxCards === 1) {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.card');
		} else {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.cards');
		}
	}
});
