import {Meteor} from "meteor/meteor";
import {AdminSettings} from "../../../api/adminSettings.js";
import "./admin_settings.html";

Template.admin_settings.events({
	'click #enableMail': function () {
		Meteor.call("updateMailSettings", true);
	},
	'click #disableMail': function () {
		Meteor.call("updateMailSettings", false);
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
	'click #sendMail': function () {
		$('#sendMail').attr('disabled','disabled');
		$('#sendWeb').attr('disabled','disabled');
		$('#sendInfo').css({'visibility': 'visible', 'color': '#F5AA01'});
		$('#sendInfo').html(TAPi18n.__('admin-settings.test-notifications.waitingForResponse'));
		Meteor.call('sendTestMail', function (error) {
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
		Meteor.call('sendTestWebNotification', function (error) {
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
	isMailEnabled: function () {
		return AdminSettings.findOne({name: "mailSettings"}).enabled;
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
	}
});
