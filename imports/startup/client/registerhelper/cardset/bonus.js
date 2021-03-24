import {BonusForm} from "../../../../util/bonusForm";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Meteor} from "meteor/meteor";
import {Bonus} from "../../../../util/bonus";
import {Profile} from "../../../../util/profile";

Template.registerHelper("getDefaultMinLearned", function () {
	return BonusForm.getDefaultMinLearned();
});

Template.registerHelper("getCurrentMinLearned", function (cardset) {
	return BonusForm.getCurrentMinLearned(cardset);
});

Template.registerHelper("getDefaultMaxBonusPoints", function () {
	return BonusForm.getDefaultMaxBonusPoints();
});

Template.registerHelper("getDefaultMinBonusPoints", function () {
	return BonusForm.getDefaultMinBonusPoints();
});

Template.registerHelper("getCurrentMaxBonusPoints", function (learningPhase) {
	return BonusForm.getCurrentMaxBonusPoints(learningPhase);
});


Template.registerHelper("getLearnphase", function (state) {
	if (state === true) {
		return TAPi18n.__('set-list.activeLearnphase');
	} else if (state === false) {
		return TAPi18n.__('set-list.inactiveLearnphase');
	} else {
		return TAPi18n.__('set-list.learnphase');
	}
});

Template.registerHelper("learningActiveAndNotEditor", function () {
	if (FlowRouter.getParam('_id')) {
		let cardset = Cardsets.findOne({"_id": FlowRouter.getParam('_id')});
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && cardset.learningActive) {
			return false;
		}
		return (cardset.owner !== Meteor.userId() && !cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("learningActiveAndEditor", function () {
	if (FlowRouter.getParam('_id')) {
		let cardset = Cardsets.findOne({"_id": FlowRouter.getParam('_id')});
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && cardset.learningActive) {
			return true;
		}
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("isBonusFinished", function (learningActive = false, learningEnd = new Date()) {
	if (learningActive && learningEnd < new Date()) {
		return true;
	}
});

Template.registerHelper('isInBonusAndProfileIncomplete', function () {
	return Bonus.isInBonus(FlowRouter.getParam('_id')) && !Profile.isCompleted();
});

Template.registerHelper('isInBonus', function () {
	return Bonus.isInBonus(FlowRouter.getParam('_id'), Meteor.userId());
});
