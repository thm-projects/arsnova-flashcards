import {Utilities} from "../../../../util/utilities";
import * as config from "../../../../config/serverBoot";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {AdminSettings} from "../../../../api/subscriptions/adminSettings";
import {Cards} from "../../../../api/subscriptions/cards";
import {LeitnerUserCardStats} from "../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {ColorThemes} from "../../../../api/subscriptions/colorThemes";
import {LeitnerPerformanceHistory} from "../../../../api/subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerActivationDay} from "../../../../api/subscriptions/leitner/leitnerActivationDay";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {LeitnerLearningWorkload} from "../../../../api/subscriptions/leitner/leitnerLearningWorkload";
import {WebPushSubscriptions} from "../../../../api/subscriptions/webPushNotifications";
import {Ratings} from "../../../../api/subscriptions/ratings";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import {LeitnerLearningPhase} from "../../../../api/subscriptions/leitner/leitnerLearningPhase";

function themeData() {
	let themes = config.initColorThemes();

	ColorThemes.remove({});
	for (let theme in themes) {
		if (themes.hasOwnProperty(theme)) {
			ColorThemes.insert(themes[theme]);
		}
	}
}

function notificationData() {
	let testNotificationsCardset = config.initTestNotificationsCardset();
	let testNotificationsCards = config.initTestNotificationsCards();
	let initTestNotificationsLeitnerUserCardStats = config.initTestNotificationsLeitnerUserCardStats();
	let testNotificationsUser = config.initTestNotificationsUser();
	let testNotificationLearningPhase = config.initTestNotifcationLeitnerLearningPhase();
	let testNotificationLearningWorkload = config.initTestNotifcationLeitnerLearningWorkload();

	//Steps for Test notifications
	testNotificationsCardset.forEach(cardset => {
		Cardsets.remove({_id: cardset._id});
		Cardsets.insert(cardset);
	});

	testNotificationsUser.forEach(user => {
		Meteor.users.remove({_id: user._id});
		Meteor.users.insert(user);
		AdminSettings.update({
				name: "testNotifications"
			},
			{
				$set: {
					testCardsetID: testNotificationsCardset[0]._id,
					testUserID: user._id
				}
			}
		);
	});

	testNotificationLearningPhase.forEach(learningPhase => {
		LeitnerLearningPhase.remove({_id: learningPhase._id});
		LeitnerLearningPhase.insert(learningPhase);
	});

	testNotificationLearningWorkload.forEach(workload => {
		LeitnerLearningWorkload.remove({_id: workload._id});
		LeitnerLearningWorkload.insert(workload);
	});

	testNotificationsCards.forEach(card => {
		Cards.remove({_id: card._id});
		Cards.insert(card);
	});

	initTestNotificationsLeitnerUserCardStats.forEach(cardStats => {
		LeitnerUserCardStats.remove({_id: cardStats._id});
		LeitnerUserCardStats.insert(cardStats);
	});

	// Make user profiles visible if one of their cards is published
	let hiddenUsers = Meteor.users.find({visible: false}).fetch();
	hiddenUsers.forEach(hiddenUser => {
		if (Cardsets.findOne({owner: hiddenUser._id, kind: {$ne: "personal"}})) {
			Meteor.users.update(hiddenUser._id, {
				$set: {
					visible: true
				}
			});
		}
	});
}

function demoData() {
	Meteor.users.insert(config.initDemoCardsetUser()[0]);
	Meteor.call('importDemoCardset', 'demo');
	Meteor.call('importDemoCardset', 'making');
}

function setupDatabaseIndex() {
	LeitnerLearningPhase._ensureIndex({cardset_id: 1, isActive: 1, isBonus: 1});
	LeitnerLearningWorkload._ensureIndex({cardset_id: 1, user_id: 1, learning_phase_id: 1, isActive: 1, isBonus: 1});
	LeitnerUserCardStats._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, learning_phase_id: 1, isActive: 1});
	LeitnerActivationDay._ensureIndex({user_id: 1, cardset_id: 1, learning_phase_id: 1});
	LeitnerPerformanceHistory._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, activation_day_id: 1, learning_phase_id: 1, box: 1});
	Wozniak._ensureIndex({user_id: 1, cardset_id: 1});
	Cards._ensureIndex({cardset_id: 1, subject: 1});
	WebPushSubscriptions._ensureIndex({user_id: 1});
	Ratings._ensureIndex({cardset_id: 1, user_id: 1});
	Cardsets._ensureIndex({name: 1, owner: 1, kind: 1, shuffled: 1, cardType: 1, difficulty: 1, wordcloud: 1, learningActive: 1});
	TranscriptBonus._ensureIndex({cardset_id: 1, user_id: 1});
	Meteor.users._ensureIndex({"profile.birthname": 1, "profile.givenname": 1, "profile.name": 1});
}

export function defaultDataStep() {
	let groupName = "Default Data";
	Utilities.debugServerBoot(config.START_GROUP, groupName);

	let itemName = "Color themes";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	themeData();
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	itemName = "Demo Cardsets";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	demoData();
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	itemName = "Database Index";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	setupDatabaseIndex();
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	itemName = "newsletter template";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	process.env.MAIL_URL = Meteor.settings.mail.url;
	SSR.compileTemplate("errors", Assets.getText("newsletter/errors.html"));
	SSR.compileTemplate("newsletter", Assets.getText("newsletter/newsletter.html"));
	Template.newsletter.helpers({
		getDocType: function () {
			return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		}
	});
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	itemName = "Test Notifications";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	notificationData();
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	defaultDataStep
};
