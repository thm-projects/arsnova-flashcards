//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./impressum.html";

/*
 * ############################################################################
 * impressum
 * ############################################################################
 */

Template.impressum.events({
	'click #back-button': function () {
		Router.go('home');
	}
});

/*
 * ############################################################################
 * agb
 * ############################################################################
 */

Template.agb.events({
	'click #back-button': function () {
		Router.go('home');
	}
});

/*
 * ############################################################################
 * datenschutz
 * ############################################################################
 */

Template.datenschutz.events({
	'click #back-button': function () {
		Router.go('home');
	}
});
