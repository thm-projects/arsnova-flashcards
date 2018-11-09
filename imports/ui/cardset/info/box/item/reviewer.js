//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./reviewer.html";

/*
* ############################################################################
* cardsetInfoBoxItemReviewer
* ############################################################################
*/

Template.cardsetInfoBoxItemReviewer.helpers({
	getReviewer: function () {
		var reviewer = Meteor.users.findOne(this.reviewer);
		return (reviewer !== undefined) ? reviewer.profile.name : undefined;
	}
});
