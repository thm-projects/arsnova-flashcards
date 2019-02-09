import "./backToCardset.html";
import {Route} from "../../../../api/route";
import {PomodoroTimer} from "../../../../api/pomodoroTimer";
import {Template} from "meteor/templating";
import {Bonus} from "../../../../api/bonus";

/*
 * ############################################################################
 * cardSidebarItemBackToCardset
 * ############################################################################
 */

Template.cardSidebarItemBackToCardset.events({
	"click .backToCardset": function () {
		if ((Route.isBox() || Route.isMemo()) && Bonus.isInBonus(Router.current().params._id, Meteor.userId())) {
			PomodoroTimer.stop();
		} else {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}
	}
});
