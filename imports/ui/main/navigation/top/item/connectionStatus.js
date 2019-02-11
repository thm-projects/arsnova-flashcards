import "./connectionStatus.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
* ############################################################################
* mainNavigationTopItemConnectionStatus
* ############################################################################
*/

Template.mainNavigationTopItemConnectionStatus.helpers({
	isModalOpen: function () {
		return Session.get('isConnectionModalOpen');
	},
	getVisibility: function () {
		if (this.visibility === 0) {
			return "visible-xs";
		} else {
			return "hidden-xs";
		}
	}
});
