import {Utilities} from "../../../../util/utilities";
import * as config from "../../../../config/serverBoot";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {AdminSettings} from "../../../../api/subscriptions/adminSettings";
import {Cards} from "../../../../api/subscriptions/cards";
import {Leitner} from "../../../../api/subscriptions/leitner";
import {ColorThemes} from "../../../../api/subscriptions/colorThemes";
import {LeitnerHistory} from "../../../../api/subscriptions/leitnerHistory";
import {LeitnerTasks} from "../../../../api/subscriptions/leitnerTasks";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {Workload} from "../../../../api/subscriptions/workload";
import {WebPushSubscriptions} from "../../../../api/subscriptions/webPushNotifications";
import {Ratings} from "../../../../api/subscriptions/ratings";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";

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
	let testNotificationsLearned = config.initTestNotificationsLearned();
	let testNotificationsUser = config.initTestNotificationsUser();

	Cardsets.remove({_id: testNotificationsCardset[0]._id});
	Cardsets.insert(testNotificationsCardset[0]);

	Meteor.users.remove({_id: testNotificationsUser[0]._id});
	Meteor.users.insert(testNotificationsUser[0]);
	AdminSettings.update({
			name: "testNotifications"
		},
		{
			$set: {
				testCardsetID: testNotificationsCardset[0]._id,
				testUserID: testNotificationsUser[0]._id
			}
		}
	);

	for (let card = 0; card < testNotificationsCards.length; card++) {
		Cards.remove({_id: testNotificationsCards[card]._id});
	}

	for (let learned = 0; learned < testNotificationsLearned.length; learned++) {
		Leitner.remove({_id: testNotificationsLearned[learned]._id});
	}

	let hiddenUsers = Meteor.users.find({visible: false}).fetch();
	for (let i = 0; i < hiddenUsers.length; i++) {
		if (Cardsets.findOne({owner: hiddenUsers[i]._id, kind: {$ne: "personal"}})) {
			Meteor.users.update(hiddenUsers[i]._id, {
				$set: {
					visible: true
				}
			});
		}
	}

	for (let card = 0; card < testNotificationsCards.length; card++) {
		Cards.insert(testNotificationsCards[card]);
	}

	for (let learned = 0; learned < testNotificationsLearned.length; learned++) {
		Leitner.insert(testNotificationsLearned[learned]);
	}
}

function demoData() {
	Meteor.users.insert(config.initDemoCardsetUser()[0]);
	Meteor.call('importDemoCardset', 'demo');
	Meteor.call('importDemoCardset', 'making');
}

function setupDatabaseIndex() {
	Leitner._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, active: 1});
	LeitnerHistory._ensureIndex({user_id: 1, cardset_id: 1, original_cardset_id: 1, task_id: 1, box: 1, dateAnswered: 1});
	LeitnerTasks._ensureIndex({user_id: 1, cardset_id: 1, session: 1});
	Wozniak._ensureIndex({user_id: 1, cardset_id: 1});
	Workload._ensureIndex({cardset_id: 1, user_id: 1});
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

	itemName = "Test Notifications";
	Utilities.debugServerBoot(config.START_RECORDING, itemName);
	notificationData();
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
	SSR.compileTemplate("newsletter", Assets.getText("newsletter/newsletter.html"));
	Template.newsletter.helpers({
		getDocType: function () {
			return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		}
	});
	Utilities.debugServerBoot(config.END_RECORDING, itemName);

	Utilities.debugServerBoot(config.END_GROUP, groupName);
}

module.exports = {
	defaultDataStep
};
