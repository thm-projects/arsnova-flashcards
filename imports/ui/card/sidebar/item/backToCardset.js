import "./backToCardset.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
		if ((Route.isBox() || Route.isMemo()) && Bonus.isInBonus(FlowRouter.getParam('_id'), Meteor.userId())) {
			PomodoroTimer.stop();
		} else {
			FlowRouter.go('cardsetdetailsid', {
				_id: FlowRouter.getParam('_id')
			});
		}
	}
});
