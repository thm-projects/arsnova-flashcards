//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./bonusRegistrationPeriod.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusRegistrationPeriod
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusRegistrationPeriod.helpers({
	getRegistrationPeriod: function () {
		return moment(this.registrationPeriod).format("DD.MM.YYYY");
	}
});
