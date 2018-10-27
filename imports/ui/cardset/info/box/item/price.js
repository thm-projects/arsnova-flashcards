//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./price.html";

/*
* ############################################################################
* cardsetInfoBoxItemPrice
* ############################################################################
*/

Template.cardsetInfoBoxItemPrice.helpers({
	hasAmount: function () {
		return this.kind === 'pro' || this.kind === 'edu';
	},
	canViewForFree: function () {
		return (this.kind === "edu" && (Roles.userIsInRole(Meteor.userId(), ['university', 'lecturer'])));
	}
});
