//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import "./requests.html";

/*
 * ############################################################################
 * profileRequests
 * ############################################################################
 */

Template.profileRequests.helpers({
	getRequests: function () {
		return Cardsets.find({request: true});
	}
});
