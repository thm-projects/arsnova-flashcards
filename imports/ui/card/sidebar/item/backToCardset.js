import "./backToCardset.html";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Route} from "../../../../util/route";
import {PomodoroTimer} from "../../../../util/pomodoroTimer";
import {Template} from "meteor/templating";
import {Bonus} from "../../../../util/bonus";

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
