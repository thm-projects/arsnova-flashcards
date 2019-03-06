import {Session} from "meteor/session";
import "./categories/algorithms/progress.html";
import "./categories/algorithms/leitner.html";
import "./categories/algorithms/wozniak.html";
import "./categories/card/editor.html";
import "./categories/cardset/bonus.html";
import "./categories/cardset/bonusStatistics.html";
import "./categories/cardset/cardView.html";
import "./categories/cardset/index.html";
import "./categories/filterResults/myCardsets.html";
import "./categories/filterResults/pool.html";
import "./categories/filterResults/repetitorium.html";
import "./categories/filterResults/shuffle.html";
import "./categories/filterResults/workload.html";
import "./categories/presentation/presentation.html";
import "./categories/profile/billing.html";
import "./categories/profile/membership.html";
import "./categories/profile/notifications.html";
import "./categories/profile/summativeProgress.html";
import "./categories/profile/requests.html";
import "./categories/profile/settings.html";
import "./categories/start.html";
import "./helpContent.html";

/*
 * ############################################################################
 * helpContentEN
 * ############################################################################
 */

Template.helpContentEN.helpers({
	displayHelpCategory: function (category) {
		return Session.get('helpFilter') === undefined || Session.get('helpFilter') === category;
	}
});
