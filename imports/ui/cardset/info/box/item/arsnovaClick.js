//------------------------ IMPORTS
import "./arsnovaClick.html";
import {Template} from "meteor/templating";
import * as config from "../../../../../config/arsnovaClick.js";

/*
* ############################################################################
* cardsetInfoBoxItemArsnovaClick
* ############################################################################
*/

Template.cardsetInfoBoxItemArsnovaClick.helpers({
	canSeeLink: function () {
		if (this.arsnovaClick !== undefined && this.arsnovaClick.session !== undefined && this.arsnovaClick.session.length) {
			return true;
		}
	},
	getLink: function () {
		return config.getURL(this.arsnovaClick.session);
	},
	getName: function () {
		return this.arsnovaClick.session;
	}
});
