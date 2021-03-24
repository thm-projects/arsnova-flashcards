import {Route} from "../../../util/route";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {LeitnerLearningWorkload} from "../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {LearningStatus} from "../../../util/learningStatus";
import {Utilities} from "../../../util/utilities";


Template.registerHelper("gotLearningStatusData", function () {
	return LearningStatus.gotData();
});

Template.registerHelper("learningStatisticsIsRep", function (type = 0) {
	if (type === 1) {
		let cardset_id = "";
		if (Route.isFilterIndex() || Route.isBox()) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else {
			cardset_id = FlowRouter.getParam('_id');
		}
		return Cardsets.findOne({_id: cardset_id}).shuffled;
	} else if (Session.get('selectedLearningHistory') !== undefined) {
		return Session.get('selectedLearningHistory')[0].cardsetShuffled;
	}
});

Template.registerHelper("learningStatisticsGetCardsetTitle", function (type = 0) {
	if (type === 1) {
		let cardset_id = "";
		if (Route.isFilterIndex() || Route.isBox()) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else {
			cardset_id = FlowRouter.getParam('_id');
		}
		return Cardsets.findOne({_id: cardset_id}).name;
	} else if (Session.get('selectedLearningHistory') !== undefined) {
		return Session.get('selectedLearningHistory')[0].cardsetTitle;
	}
});

Template.registerHelper("learningStatisticsIsInBonus", function (type = 0) {
	if (Route.isFilterIndex() || Route.isBox()) {
		let cardset_id = "";
		if (type === 1) {
			cardset_id = Session.get('workloadProgressCardsetID');
		} else if (Session.get('selectedLearningHistory') !== undefined) {
			cardset_id = Session.get('selectedLearningHistory')[0].cardset_id;
		}
		let workload = LeitnerLearningWorkload.findOne({user_id: Meteor.userId(), cardset_id: cardset_id});
		if (workload !== undefined) {
			return workload.isBonus;
		}
	} else {
		return Session.get('selectedLearningStatisticsUser').isInBonus;
	}
});

Template.registerHelper("learningStatisticsHideUserName", function () {
	return Session.get('hideUserNames') && !(Route.isFilterIndex() || Route.isBox());
});

Template.registerHelper("learningStatisticsGetEMail", function () {
	let email = TAPi18n.__('profile.finishProfile');
	let gotEmail = false;
	if ((Route.isFilterIndex() || Route.isBox()) && Meteor.user().email !== undefined && Meteor.user().email !== "") {
		email = Meteor.user().email;
		gotEmail = true;
	} else if (Session.get('selectedLearningStatisticsUser') !== undefined && Session.get('selectedLearningStatisticsUser').email !== undefined && Session.get('selectedLearningStatisticsUser') !== "") {
		email = Session.get('selectedLearningStatisticsUser').email;
		gotEmail = true;
	}
	if (gotEmail) {
		return `<a rel="noopener noreferrer" href="mailto:${email}">${email}</a>`;
	} else {
		return email;
	}
});

Template.registerHelper("learningStatisticsGetUserName", function () {
	let name = TAPi18n.__('profile.finishProfile');
	if (Session.get('hideUserNames') && !(Route.isFilterIndex() || Route.isBox())) {
		return TAPi18n.__('learningStatistics.hiddenUserPlaceholder', {index: Session.get('selectedLearningStatisticsUser').index});
	} else if ((Route.isFilterIndex() || Route.isBox()) && Meteor.user().profile.givenname !== undefined && Meteor.user().profile.birthname !== undefined) {
		name = `${Meteor.user().profile.givenname} ${Meteor.user().profile.birthname}`;
	} else if (Session.get('selectedLearningStatisticsUser') !== undefined && Session.get('selectedLearningStatisticsUser').firstName !== undefined && Session.get('selectedLearningStatisticsUser').lastName !== undefined) {
		name = `${Session.get('selectedLearningStatisticsUser').firstName} ${Session.get('selectedLearningStatisticsUser').lastName}`;
	}
	return name;
});


Template.registerHelper("learningStatisticsGetLastActivity", function (type = 0) {
	let lastActivity = "";
	if (type === 1) {
		lastActivity = Session.get('lastLearningStatusActivity');
	} else if (Session.get('selectedLearningHistory') !== undefined) {
		lastActivity = Session.get('selectedLearningHistory')[0].lastActivity;
	}
	if (lastActivity instanceof Date) {
		return Utilities.getMomentsDate(lastActivity, true, 0, false);
	} else {
		return TAPi18n.__('learningStatistics.table.general.lastActivityMissing');
	}
});


