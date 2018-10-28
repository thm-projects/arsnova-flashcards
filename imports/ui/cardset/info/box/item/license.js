//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./license.html";

/*
* ############################################################################
* cardsetInfoBoxItemLicense
* ############################################################################
*/

Template.cardsetInfoBoxItemLicense.events({
	'click .showLicense': function (event) {
		event.preventDefault();
		Session.set('selectedCardset', $(event.target).data('id'));
	}
});
