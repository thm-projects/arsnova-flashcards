import "./backToCardset.html";
import {Route} from "../../../../api/route";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";

/*
 * ############################################################################
 * cardSidebarItemBackToCardset
 * ############################################################################
 */

Template.cardSidebarItemBackToCardset.events({
	"click .backToCardset": function () {
		if (Route.isBox() || Route.isMemo()) {
			PomodoroTimer.stop();
		} else {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}
	}
});
