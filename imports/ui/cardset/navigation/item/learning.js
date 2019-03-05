//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Leitner} from "../../../../api/learned";
import {Cardsets} from "../../../../api/cardsets";
import {CardsetNavigation} from "../../../../api/cardsetNavigation";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./learning.html";

/*
 * ############################################################################
 * cardsetNavigationLearning
 * ############################################################################
 */

Template.cardsetNavigationLearning.helpers({
	notEmpty: function () {
		return Leitner.find({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
	}
});

Template.cardsetNavigationLearning.events({
	"click #learnBoxActive": function () {
		Router.go('box', {
			_id: Router.current().params._id
		});
	}
});

Template.cardsetNavigationLearning.onCreated(function () {
	CardsetNavigation.addToLeitner(Session.get('activeCardset')._id);
});

Template.cardsetNavigationLearning.onRendered(function () {
	setTimeout(function () {
		Bert.defaults.hideDelay = 10000;
		let bertType = "success";
		if (Session.get('activeCardset').learningEnd.getTime() > new Date().getTime()) {
			let text = "";
			if (Leitner.find({
				cardset_id: Session.get('activeCardset')._id,
				user_id: Meteor.userId(),
				active: true
			}).count()) {
				var active = Leitner.findOne({
					cardset_id: Session.get('activeCardset')._id,
					user_id: Meteor.userId(),
					active: true
				});
				var deadline = new Date(active.currentDate.getTime() + Session.get('activeCardset').daysBeforeReset * 86400000);
				if (deadline.getTime() > Session.get('activeCardset').learningEnd.getTime()) {
					text += (TAPi18n.__('deadlinePrologue') + moment(Session.get('activeCardset').learningEnd).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue1'));
				} else {
					text += (TAPi18n.__('deadlinePrologue') + moment(deadline).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue2'));
				}
				bertType = "warning";
			} else {
				if (Leitner.find({
					cardset_id: Session.get('activeCardset')._id,
					user_id: Meteor.userId(),
					box: {$ne: 6}
				}).count() === 0) {
					text += TAPi18n.__('bonus.message.learnedEverything');
				} else {
					let nextCardDate = Leitner.findOne({
						cardset_id: Router.current().params._id,
						user_id: Meteor.userId(),
						box: {$ne: 6}
					}, {sort: {nextDate: 1}}).nextDate;
					let learningEnd = Cardsets.findOne({_id: Router.current().params._id}).learningEnd;
					if (nextCardDate.getTime() > learningEnd.getTime()) {
						text += TAPi18n.__('noMoreCardsBeforeEnd');
					}
					let nextDate;
					if (nextCardDate.getTime() < new Date().getTime()) {
						nextDate = moment(new Date()).locale("de");
					} else {
						nextDate = moment(nextCardDate).locale("de");
					}
					if (nextDate.get('hour') >= Meteor.settings.public.dailyCronjob.executeAtHour) {
						nextDate.add(1, 'day');
					}
					nextDate.hour(Meteor.settings.public.dailyCronjob.executeAtHour);
					nextDate.minute(0);
					text += TAPi18n.__('noCardsToLearn') + nextDate.format("D. MMMM") + TAPi18n.__('at') + nextDate.format("HH:mm") + TAPi18n.__('released');
				}
			}
			BertAlertVisuals.displayBertAlert(text, bertType, 'growl-top-left');
		} else {
			BertAlertVisuals.displayBertAlert(TAPi18n.__('bonus.message.bonusEnded'), bertType, 'growl-top-left');
		}
		Bert.defaults.hideDelay = 10000;
	}, 2000);
});
