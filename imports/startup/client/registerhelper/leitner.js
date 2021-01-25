import {Meteor} from "meteor/meteor";
import {Route} from "../../../util/route";
import {Bonus} from "../../../util/bonus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Workload} from "../../../api/subscriptions/workload";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {Session} from "meteor/session";

Template.registerHelper("gotLeitnerTimerDebugEnabled", function () {
	return Meteor.settings.public.debug.leitnerTimer && Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'));
});

Template.registerHelper("getNextCardTime", function () {
	let workload = Workload.findOne({cardset_id: FlowRouter.getParam('_id'), user_id: Meteor.userId()});
	let learningEnd = Cardsets.findOne({_id: FlowRouter.getParam('_id')}).learningEnd;
	if (workload !== undefined && workload.leitner !== undefined && workload.leitner.nextDate !== undefined && learningEnd !== undefined) {
		if (workload.leitner.nextDate.getTime() > learningEnd.getTime()) {
			return TAPi18n.__('noMoreCardsBeforeEnd');
		}
		let nextDate;
		if (workload.leitner.nextDate.getTime() < new Date().getTime()) {
			nextDate = moment(new Date()).locale(Session.get('activeLanguage'));
		} else {
			nextDate = moment(workload.leitner.nextDate).locale(Session.get('activeLanguage'));
		}
		if (nextDate.get('hour') >= Meteor.settings.public.dailyCronjob.executeAtHour) {
			nextDate.add(1, 'day');
		}
		nextDate.hour(Meteor.settings.public.dailyCronjob.executeAtHour);
		nextDate.minute(0);
		return TAPi18n.__('noCardsToLearn') + nextDate.format("D. MMMM") + TAPi18n.__('at') + nextDate.format("HH:mm") + TAPi18n.__('released');
	}
});
