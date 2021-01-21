import {Meteor} from "meteor/meteor";
import {Route} from "../../../util/route";
import {Bonus} from "../../../util/bonus";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LeitnerProgress} from "../../../util/leitnerProgress";
import {Workload} from "../../../api/subscriptions/workload";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {Session} from "meteor/session";

Template.registerHelper("gotLeitnerTimerDebugEnabled", function () {
	return Meteor.settings.public.debug.leitnerTimer && Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'));
});

Template.registerHelper("gotLocalLeitnerGraphData", function () {
	return LeitnerProgress.gotData();
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

Template.registerHelper("leitnerProgressStatsIsRep", function (type = 0) {
	if (type === 1) {
		let cardset_id = "";
		if (Route.isFilterIndex() || Route.isBox()) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else {
			cardset_id = FlowRouter.getParam('_id');
		}
		return Cardsets.findOne({_id: cardset_id}).shuffled;
	} else if (Session.get('selectedBonusUserHistoryData') !== undefined) {
		return Session.get('selectedBonusUserHistoryData')[0].cardsetShuffled;
	}
});

Template.registerHelper("leitnerProgressStatsGetCardsetTitle", function (type = 0) {
	if (type === 1) {
		let cardset_id = "";
		if (Route.isFilterIndex() || Route.isBox()) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else {
			cardset_id = FlowRouter.getParam('_id');
		}
		return Cardsets.findOne({_id: cardset_id}).name;
	} else if (Session.get('selectedBonusUserHistoryData') !== undefined) {
		return Session.get('selectedBonusUserHistoryData')[0].cardsetTitle;
	}
});

Template.registerHelper("leitnerProgressStatsIsInBonus", function (type = 0) {
	if (Route.isFilterIndex() || Route.isBox()) {
		let cardset_id = "";
		if (type === 1) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else if (Session.get('selectedBonusUserHistoryData') !== undefined) {
			cardset_id = Session.get('selectedBonusUserHistoryData')[0].cardset_id;
		}
		let workload = Workload.findOne({user_id: Meteor.userId(), cardset_id: cardset_id});
		if (workload !== undefined) {
			return workload.leitner.bonus;
		}
	} else {
		return Session.get('selectedBonusUser').isInBonus;
	}
});

Template.registerHelper("leitnerProgressStatsHideUserName", function () {
	return Session.get('hideUserNames') && !(Route.isFilterIndex() || Route.isBox());
});

Template.registerHelper("leitnerProgressStatsGetEMail", function () {
	let email = "";
	if (Route.isFilterIndex() || Route.isBox()) {
		email = Meteor.user().email;
	} else {
		email = Session.get('selectedBonusUser').email;
	}

	return `<a href="mailto:${email}">${email}</a>`;
});

Template.registerHelper("leitnerProgressStatsGetUserName", function () {
	if (Session.get('hideUserNames') && !(Route.isFilterIndex() || Route.isBox())) {
		return TAPi18n.__('leitnerProgress.hiddenUserPlaceholder', {index: Session.get('selectedBonusUser').index});
	} else if (Route.isFilterIndex() || Route.isBox()) {
		return `${Meteor.user().profile.birthname}, ${Meteor.user().profile.givenname}`;
	} else {
		return `${Session.get('selectedBonusUser').lastName}, ${Session.get('selectedBonusUser').firstName}`;
	}
});
