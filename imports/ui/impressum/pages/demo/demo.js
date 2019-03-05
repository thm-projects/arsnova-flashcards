import {Template} from "meteor/templating";
import {Route} from "../../../../api/route";
import "./demo.html";

/*
 * ############################################################################
 * demo
 * ############################################################################
 */

Template.demo.helpers({
	isFirstTimeVisit: function () {
		return Route.isFirstTimeVisit();
	}
});
