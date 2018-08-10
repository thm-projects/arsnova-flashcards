import {Session} from "meteor/session";
import "./categories/algorithms/leitner.html";
import "./categories/algorithms/progress.html";
import "./categories/algorithms/wozniak.html";
import "./categories/card/editor.html";
import "./categories/cardset/bonus.html";
import "./categories/cardset/cardset.html";
import "./categories/filterResults/myCardsets.html";
import "./categories/filterResults/pool.html";
import "./categories/filterResults/repetitorium.html";
import "./categories/filterResults/shuffle.html";
import "./categories/filterResults/workload.html";
import "./categories/profile/billing.html";
import "./categories/profile/membership.html";
import "./categories/profile/notifications.html";
import "./categories/profile/requests.html";
import "./categories/profile/settings.html";
import "./categories/start.html";
import "./help.html";

/*
 * ############################################################################
 * help
 * ############################################################################
 */

Template.help.helpers({
	displayHelpCategory: function (category) {
		return Session.get('helpTarget') === undefined || Session.get('helpTarget') === category;
	}
});
