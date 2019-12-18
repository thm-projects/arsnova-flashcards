//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "../../modal/license.js";
import "./licenseRep.html";

/*
* ############################################################################
* cardsetInfoBoxItemLicenseRep
* ############################################################################
*/

Template.cardsetInfoBoxItemLicenseRep.events({
	'click .showLicense': function (event) {
		event.preventDefault();
		Session.set('selectedCardset', $(event.target).data('id'));
	}
});
