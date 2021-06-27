//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../util/bertAlertVisuals";
import "../modal/deleteProfile.js";
import "../../cardset/navigation/modal/bonus/leave/leave.js";
import "../view/public.js";
import "./settings.html";
import {ServerSettings} from "../../../util/settings";
import {ServerStyle} from "../../../util/styles";
import {UserPermissions} from "../../../util/permissions";
import {ThemeSwitcher} from "../../../util/themeSwitcher";

/*
 * ############################################################################
 * profileSettings
 * ############################################################################
 */

Template.profileSettings.helpers({
	getProfileName: function (casName, cardsName) {
		if (casName !== undefined && casName.length > 0) {
			return casName;
		} else {
			return cardsName;
		}
	},
	gotMultipleRoles: function (count) {
		return count >= 2;
	},
	/** Function returns "selected" when the value of the selectedLanguage and the input _id are the same */
	getSelectedLanguage: function (id) {
		if (id === Meteor.users.findOne(Meteor.userId()).profile.locale) {
			return "selected";
		}
	},
	getMailNotifications: function () {
		if (Meteor.users.findOne(Meteor.userId()).mailNotification) {
			return "checked";
		}
	},
	getWebNotifications: function () {
		if (Meteor.users.findOne(Meteor.userId()).webNotification) {
			return "checked";
		}
	},
	isDisabledCancelProfile: function () {
		return Session.get("profileSettingsCancel");
	},
	isDisabledSaveProfile: function () {
		return Session.get("profileSettingsSave");
	},
	isDisabledSaveTheme: function () {
		return Session.get("themeSettings");
	},
	isDisabledSaveLanguage: function () {
		return Session.get("languageSettings");
	}
});

/** Function resets the temporary selected color theme */
Template.profileSettings.onDestroyed(function () {
	// Go back to last saved Theme
	if (Meteor.user()) {
		Session.set("theme", ThemeSwitcher.getSavedThemeID());
		Session.set("language", Meteor.user().profile.locale);
	}
});

Template.profileSettings.onCreated(function () {
	Session.set("profileSettingsCancel", true);
	Session.set("profileSettingsSave", true);
	Session.set("themeSettings", true);
	Session.set("languageSettings", true);
});

Template.profileSettings.events({
	"click .themeSelection": function (event) {
		Session.set("theme", $(event.currentTarget).data('id'));
		ThemeSwitcher.displayTheme();
	},
	"click #profilepublicoption1": function () {
		Meteor.call("updateUsersVisibility", true, Meteor.userId());
	},
	"click #profilepublicoption2": function () {
		Meteor.call("updateUsersVisibility", false, Meteor.userId());
	},
	"keyup #inputEmail": function () {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var email = $('#inputEmail').val();
		var validEmail = re.test(email);
		Session.set("profileSettingsCancel", false);

		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			Session.set("profileSettingsSave", false);
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			Session.set("profileSettingsSave", false);
		} else {//E-Mail was changed and is wrong
			Session.set("profileSettingsSave", true);
		}

		if (validEmail === false) {
			$('#inputEmail').parent().parent().addClass('has-error');
			$('#errorEmail').html(TAPi18n.__('panel-body.emailInvalid'));
		} else {
			$('#inputEmail').parent().parent().removeClass('has-error');
			$('#inputEmail').parent().parent().addClass('has-success');
			$('#errorEmail').html('');
			$('#inputEmailValidationForm').removeClass("hidden");
		}
	},
	"keyup #inputEmailValidation": function () {
		Session.set("profileSettingsCancel", false);
		if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {
			Session.set("profileSettingsSave", false);
			$('#inputEmailValidation').parent().parent().removeClass('has-error');
			$('#inputEmailValidation').parent().parent().addClass('has-success');
			$('#errorEmailValidation').html('');
		} else {
			Session.set("profileSettingsSave", true);
			$('#inputEmailValidation').parent().parent().removeClass('has-success');
			$('#inputEmailValidation').parent().parent().addClass('has-error');
			$('#errorEmailValidation').html(TAPi18n.__('panel-body.emailValidationError'));
		}
	},
	"keyup #inputBirthName": function () {
		Session.set("profileSettingsCancel", false);
		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			Session.set("profileSettingsSave", false);
			Session.set("profileSettingsCancel", false);
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			Session.set("profileSettingsSave", false);
			Session.set("profileSettingsCancel", false);
		} else {//E-Mail was changed and is wrong
			Session.set("profileSettingsSave", true);
			Session.set("profileSettingsCancel", true);
		}
	},
	"keyup #inputGivenName": function () {
		Session.set("profileSettingsCancel", false);
		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			Session.set("profileSettingsSave", false);
			Session.set("profileSettingsCancel", false);
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			Session.set("profileSettingsSave", false);
			Session.set("profileSettingsCancel", false);
		} else {//E-Mail was changed and is wrong
			Session.set("profileSettingsSave", true);
			Session.set("profileSettingsCancel", true);
		}
	},
	/** Function evaluates the currently selected color theme of the input box and saves it to the database */
	"click #colorThemeSave": function () {
		let selected = $('#colorThemeSelect').val();
		let user_id = Meteor.userId();

		Session.set("themeSettings", true);
		Meteor.call("updateColorTheme", selected, user_id);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
	},
	/** Function evaluates the currently selected language of the input box and saves it to the database */
	"click #languageSave": function () {
		let selected = $('#languageSelect').val();
		let user_id = Meteor.userId();

		Session.set("languageSettings", true);
		Meteor.call("updateLanguage", selected, user_id);
		TAPi18n.setLanguage(selected);
		Session.set('activeLanguage', selected);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
	},
	/** Function changes the temporary color theme when the input box changes its value */
	"change #colorThemeSelect": function () {
		let selected = $('#colorThemeSelect').val();
		Session.set("themeSettings", false);
		// Set session variable. Will be reset to value from mongoDB when template is destroyed
		Session.set("theme", selected);
	},
	/** Function changes the temporary language when the input box changes its value */
	"change #languageSelect": function () {
		let selected = $('#languageSelect').val();
		Session.set("languageSettings", false);
		// Set session variable. Will be reset to value from mongoDB when template is destroyed
		Session.set("language", selected);
	},
	"click #profileSave": function () {
		// Email validation
		let email = "";
		let validEmail = true;
		if (!UserPermissions.isCardsLogin()) {
			let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			email = $('#inputEmail').val();
			validEmail = re.test(email);

			if (validEmail === false) {
				$('#inputEmail').parent().parent().addClass('has-error');
				$('#errorEmail').html(TAPi18n.__('panel-body.emailInvalid'));
			} else {
				$('#inputEmail').parent().parent().removeClass('has-error');
				$('#inputEmail').parent().parent().addClass('has-success');
				$('#errorEmail').html('');
			}
		}

		// Birth Name validation
		var birthname = $('#inputBirthName').val().trim();
		var validBirthName = false;

		if (birthname.length <= 0) {
			$('#inputBirthName').parent().parent().addClass('has-error');
			$('#errorBirthName').html(TAPi18n.__('panel-body.birthnameEmpty'));
		} else {
			$('#inputBirthName').parent().parent().removeClass('has-error');
			$('#inputBirthName').parent().parent().addClass('has-success');
			$('#errorBirthName').html('');
			$('#inputBirthName').val(birthname);
			validBirthName = true;
		}

		// Given Name validation
		var givenname = $('#inputGivenName').val().trim();
		var validGivenName = false;

		if (givenname.length <= 0) {
			$('#inputGivenName').parent().parent().addClass('has-error');
			$('#errorGivenName').html(TAPi18n.__('panel-body.givennameEmpty'));
		} else {
			$('#inputGivenName').parent().parent().removeClass('has-error');
			$('#inputGivenName').parent().parent().addClass('has-success');
			$('#errorGivenName').html('');
			$('#inputGivenName').val(givenname);
			validGivenName = true;
		}

		// Name validation
		let user_id = Meteor.userId();
		if (validEmail && validBirthName && validGivenName) {
			let mailNotification = Meteor.user().mailNotification;
			if (ServerSettings.isMailEnabled()) {
				mailNotification = document.getElementById('mailNotificationCheckbox').checked;
			}
			let webNotification = Meteor.user().webNotification;
			if (ServerSettings.isPushEnabled()) {
				webNotification = document.getElementById('webNotificationCheckbox').checked;
			}
			$('#inputEmailValidation').val('');
			$('#inputEmailValidationForm').addClass("hidden");
			Session.set("profileSettingsSave", true);
			Session.set("profileSettingsCancel", true);
			if (!UserPermissions.isCardsLogin()) {
				Meteor.call("updateUsersEmail", email, user_id);
			}
			Meteor.call("updateUsersBirthName", birthname, user_id);
			Meteor.call("updateUsersGivenName", givenname, user_id);
			Meteor.call("updateUsersProfileState", true, user_id);
			Meteor.call("updateUsersNotification", mailNotification, webNotification, user_id);
			if (ServerStyle.getAppThemes().length > 1) {
				Meteor.call("updateUserTheme", Session.get("theme"));
				$('#appThemeSelector').addClass('has-success');
			}

			BertAlertVisuals.displayBertAlert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
		} else {
			BertAlertVisuals.displayBertAlert(TAPi18n.__('profile.error'), 'warning', 'growl-top-left');
		}
	},
	"change #mailNotificationCheckbox, change #webNotificationCheckbox": function () {
		Session.set("profileSettingsSave", false);
		Session.set("profileSettingsCancel", false);
		$('#errorNotification').html('');
	},
	"click #profileCancel": function () {
		var user = Meteor.users.findOne(Meteor.userId());
		if (!UserPermissions.isCardsLogin()) {
			$('#inputEmail').val(user.email);
			$('#inputEmail').parent().parent().removeClass('has-error');
			$('#errorEmail').html('');
			$('#inputEmailValidation').val('');
			$('#inputEmailValidationForm').addClass("hidden");
			$('#inputEmail').parent().parent().removeClass('has-success');
		}
		$('#inputName').val(user.profile.name);
		$('#inputBirthName').val(user.profile.birthname);
		$('#inputGivenName').val(user.profile.givenname);
		$('#mailNotificationCheckbox').prop('checked', user.mailNotification);
		$('#webNotificationCheckbox').prop('checked', user.webNotification);
		$('#inputName').parent().parent().removeClass('has-error');
		$('#inputBirthName').parent().parent().removeClass('has-error');
		$('#inputGivenName').parent().parent().removeClass('has-error');
		$('#inputName').parent().parent().removeClass('has-success');
		$('#inputBirthName').parent().parent().removeClass('has-success');
		$('#inputGivenName').parent().parent().removeClass('has-success');
		$('#appThemeSelector').removeClass('has-success');
		$('#errorName').html('');
		$('#errorBirthName').html('');
		$('#errorGivenName').html('');
		Session.set("profileSettingsSave", true);
		Session.set("profileSettingsCancel", true);
		ThemeSwitcher.setTheme();
		BertAlertVisuals.displayBertAlert(TAPi18n.__('profile.canceled'), 'danger', 'growl-top-left');
	}
});
