import {Meteor} from "meteor/meteor";
import {AdminSettings} from "../../../api/subscriptions/adminSettings.js";
import "./settings.html";
import {ServerSettings} from "../../../util/settings";

Template.admin_settings.events({
	'click #enableWordcloudPomodoro': function () {
		Meteor.call("updateWordcloudPomodoroSettings", true);
	},
	'click #disableWordcloudPomodoro': function () {
		Meteor.call("updateWordcloudPomodoroSettings", false);
	},
	'click #enableMail': function () {
		Meteor.call("updateMailSettings", true);
	},
	'click #disableMail': function () {
		Meteor.call("updateMailSettings", false);
	},
	'click #enablePush': function () {
		Meteor.call("updatePushSettings", true);
	},
	'click #disablePush': function () {
		Meteor.call("updatePushSettings", false);
	},
	'click #setNotificationTarget': function (evt, tmpl) {
		Meteor.call('changeNotificationTarget', tmpl.find('#notificationTarget').value, function (error, result) {
			if (error || result === false) {
				$('#setTargetInfo').css({'visibility': 'visible', 'color': '#9C132D'});
				$('#setTargetInfo').html(TAPi18n.__('admin-settings.test-notifications.targetError'));
			} else {
				$('#setTargetInfo').css({'visibility': 'visible', 'color': '#78B925'});
				$('#setTargetInfo').html(TAPi18n.__('admin-settings.test-notifications.setSuccess'));
			}
		});
	},
	'click #setPlantUMLServerTarget': function (evt, tmpl) {
		Meteor.call('changePlantUMLServerTarget', tmpl.find('#plantUMLServerTarget').value, function () {
			$('#setPlantUMLServerTargetInfo').css({'visibility': 'visible', 'color': '#78B925'});
			$('#setPlantUMLServerTargetInfo').html(TAPi18n.__('admin-settings.plantUML.setSuccess'));
		});
	},
	'click #sendMail': function () {
		$('#sendMail').attr('disabled','disabled');
		$('#sendWeb').attr('disabled','disabled');
		$('#sendInfo').css({'visibility': 'visible', 'color': '#F5AA01'});
		$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.waitingForResponse'));
		let messageType = $('input[name="testNotificationType"]:checked').data('type');
		Meteor.call('sendTestMail', messageType, function (error) {
			if (error) {
				$('#sendInfo').css({'visibility': 'visible', 'color': '#9C132D'});
				$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.sendMailError'));
			} else {
				$('#sendInfo').css({'visibility': 'visible', 'color': '#78B925'});
				$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.sendMailSuccess'));
			}
			$('#sendMail').removeAttr('disabled');
			$('#sendWeb').removeAttr('disabled');
		});
	},
	'click #sendWeb': function () {
		$('#sendMail').attr('disabled','disabled');
		$('#sendWeb').attr('disabled','disabled');
		$('#sendInfo').css({'visibility': 'visible', 'color': '#F5AA01'});
		$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.waitingForResponse'));
		let messageType = $('input[name="testNotificationType"]:checked').data('type');
		Meteor.call('sendTestWebNotification', messageType, function (error) {
			if (error) {
				$('#sendInfo').css({'visibility': 'visible', 'color': '#9C132D'});
				$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.sendWebError'));
			} else {
				$('#sendInfo').css({'visibility': 'visible', 'color': '#78B925'});
				$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.sendWebSuccess'));
			}
			$('#sendMail').removeAttr('disabled');
			$('#sendWeb').removeAttr('disabled');
		});
	}
});

Template.admin_settings.helpers({
	isWordcloudPomodoroEnabled: function () {
		return AdminSettings.findOne({name: "wordcloudPomodoroSettings"}).enabled;
	},
	isMailEnabled: function () {
		return ServerSettings.isMailEnabled();
	},
	isPushEnabled: function () {
		return ServerSettings.isPushEnabled();
	},
	getNotificationTargetText: function () {
		let user = Meteor.users.findOne({_id: AdminSettings.findOne({name: "testNotifications"}).target});
		if (user === undefined) {
			return false;
		}
		return user.profile.givenname + ", " + user.profile.birthname + ", " + user.email;
	},
	checkNotificationTarget: function () {
		let user = Meteor.users.findOne({_id: AdminSettings.findOne({name: "testNotifications"}).target});
		if (user === undefined) {
			return false;
		}
		return true;
	},
	getPlantUMLServerTarget: function () {
		return AdminSettings.findOne({name: "plantUMLServerSettings"}).url;
	},
	getPlantUMLPreviewContent: function () {
		return "\`\`\`plantuml\n@startuml\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\nAlice -> Bob: Another authentication Request\nAlice <-- Bob: another authentication Response\n@enduml\n\`\`\`";
	}
});
