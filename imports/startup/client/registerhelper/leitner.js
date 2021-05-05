import {Meteor} from "meteor/meteor";
import {Route} from "../../../util/route";
import {Bonus} from "../../../util/bonus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Session} from "meteor/session";
import {LeitnerLearningWorkloadUtilities} from "../../../util/learningWorkload";
import {LeitnerLearningPhaseUtilities} from "../../../util/learningPhase";

Template.registerHelper("gotLeitnerTimerDebugEnabled", function () {
	return Meteor.settings.public.debug.leitnerTimer && Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'));
});

Template.registerHelper("getNextCardTime", function () {
	let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(FlowRouter.getParam('_id'), Meteor.userId());
	let leitnerLearningPhase = LeitnerLearningPhaseUtilities.getActiveLearningPhase(undefined, undefined, leitnerLearningWorkload.learning_phase_id);
	if (leitnerLearningPhase !== undefined) {
		if (leitnerLearningWorkload.nextActivationDate.getTime() > leitnerLearningPhase.end.getTime()) {
			return TAPi18n.__('noMoreCardsBeforeEnd');
		}
		let nextDate;
		if (leitnerLearningWorkload.nextActivationDate.getTime() < new Date().getTime()) {
			nextDate = moment(new Date()).locale(Session.get('activeLanguage'));
		} else {
			nextDate = moment(leitnerLearningWorkload.nextActivationDate).locale(Session.get('activeLanguage'));
		}
		if (nextDate.get('hour') >= Meteor.settings.public.dailyCronjob.executeAtHour) {
			nextDate.add(1, 'day');
		}
		nextDate.hour(Meteor.settings.public.dailyCronjob.executeAtHour);
		nextDate.minute(0);
		return TAPi18n.__('noCardsToLearn') + nextDate.format("D. MMMM") + TAPi18n.__('at') + nextDate.format("HH:mm") + TAPi18n.__('released');
	}
});
