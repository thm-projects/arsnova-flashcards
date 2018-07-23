//------------------------ IMPORTS

import {APIAccess} from "../../../api/cardsetAPI.js";
import "./admin_apiAccess.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * admin_apiAccess
 * ############################################################################
 */

Template.admin_apiAccess.helpers({
	apiAccessTokens: function () {
		var apiAccessTokens = APIAccess.find();

		return apiAccessTokens;
	}
});
