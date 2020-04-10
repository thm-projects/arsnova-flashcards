//------------------------ IMPORTS
import "./fragJetzt.html";
import {Template} from "meteor/templating";
import * as config from "../../../../../config/fragJetzt.js";

/*
* ############################################################################
* cardsetInfoBoxItemFragJetzt
* ############################################################################
*/

Template.cardsetInfoBoxItemFragJetzt.helpers({
	canSeeLink: function () {
		if (this.fragJetzt !== undefined && this.fragJetzt.session !== undefined && this.fragJetzt.session.length) {
			return true;
		}
	},
	getLink: function () {
		return config.getURL(this.fragJetzt.session);
	},
	getName: function () {
		return this.fragJetzt.session;
	}
});
