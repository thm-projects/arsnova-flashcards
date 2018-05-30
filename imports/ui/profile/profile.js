//------------------------ IMPORTS


import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {ColorThemes} from "../../api/theme.js";
import {Paid} from "../../api/paid.js";
import {Notifications} from "../../api/notifications.js";
import "./profile.html";

Meteor.subscribe("notifications");
Meteor.subscribe("cardsets");
Meteor.subscribe("colorThemes");
Meteor.subscribe('default_db_data', function () {
	Session.set('data_loaded', true);
});
Meteor.subscribe('leitner', function () {
	Session.set('data_ready', true);
});

Template.registerHelper("getUser", function () {
	var user = Meteor.users.findOne(Router.current().params._id);
	Session.set("user", user);
	return user;
});
Template.registerHelper("isUser", function () {
	return Router.current().params._id === Meteor.userId();
});

/*
 * ############################################################################
 * profile
 * ############################################################################
 */

Template.profile.helpers({
	isVisible: function () {
		var userId = Router.current().params._id;
		if (userId !== undefined) {
			var user = Meteor.users.findOne(userId);
			if (user !== undefined) {
				return userId === Meteor.userId() || user.visible;
			}
		}
		return null;
	}
});

/*
 * ############################################################################
 * profileSidebar
 * ############################################################################
 */

Template.profileSidebar.helpers({
	getService: function () {
		var userId = Router.current().params._id;
		if (userId !== undefined) {
			var user = Meteor.users.findOne(userId);
			if (user !== undefined && user.services !== undefined) {
				var service = _.keys(user.services)[0];
				service = service.charAt(0).toUpperCase() + service.slice(1);
				return service;
			}
		}
		return null;
	}
});

/*
 * ############################################################################
 * profileSettings
 * ############################################################################
 */

Template.profileSettings.helpers({
	/** Function returns all colorThemes from the databse */
	getColorThemes: function () {
		return ColorThemes.find();
	},
	/** Function returns "selected" when the value of the selectedColorTheme and the input _id are the same */
	getSelectedColorThemes: function () {
		if (this._id === Meteor.users.findOne(Meteor.userId()).selectedColorTheme) {
			return "selected";
		}
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
	Session.set("theme", Meteor.users.findOne(Meteor.userId()).selectedColorTheme);
	Session.set("language", Meteor.users.findOne(Meteor.userId()).profile.locale);
});

Template.profileSettings.onCreated(function () {
	Session.set("profileSettingsCancel", true);
	Session.set("profileSettingsSave", true);
	Session.set("themeSettings", true);
	Session.set("languageSettings", true);
});

Template.profileSettings.events({
	"click #profilepublicoption1": function () {
		Meteor.call("updateUsersVisibility", true);
	},
	"click #profilepublicoption2": function () {
		Meteor.call("updateUsersVisibility", false);
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
	"keyup #inputName": function () {
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
		Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
	},
	/** Function evaluates the currently selected language of the input box and saves it to the database */
	"click #languageSave": function () {
		let selected = $('#languageSelect').val();
		let user_id = Meteor.userId();

		Session.set("languageSettings", true);
		Meteor.call("updateLanguage", selected, user_id);
		TAPi18n.setLanguage(selected);
		Session.set('activeLanguage', selected);
		Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
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
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var email = $('#inputEmail').val();
		var validEmail = re.test(email);

		if (validEmail === false) {
			$('#inputEmail').parent().parent().addClass('has-error');
			$('#errorEmail').html(TAPi18n.__('panel-body.emailInvalid'));
		} else {
			$('#inputEmail').parent().parent().removeClass('has-error');
			$('#inputEmail').parent().parent().addClass('has-success');
			$('#errorEmail').html('');
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
		var name = $('#inputName').val();
		var user_id = Meteor.userId();

		Meteor.call("checkUsersName", name, user_id, function (error, result) {
			if (error) {
				$('#inputName').parent().parent().addClass('has-error');
				$('#errorName').html(TAPi18n.__('panel-body.nameAlreadyExists'));
			} else {
				var validName = false;
				if (result.length < 5) {
					$('#inputName').parent().parent().addClass('has-error');
					$('#errorName').html(TAPi18n.__('panel-body.nameToShort'));
				} else if (result.length > 25) {
					$('#inputName').parent().parent().addClass('has-error');
					$('#errorName').html(TAPi18n.__('panel-body.nameToLong'));
				} else {
					$('#inputName').parent().parent().removeClass('has-error');
					$('#inputName').parent().parent().addClass('has-success');
					$('#errorName').html('');
					name = result;
					validName = true;
				}
				if (validEmail && validName && validBirthName && validGivenName) {
					let mailNotification = document.getElementById('mailNotificationCheckbox').checked;
					let webNotification = document.getElementById('webNotificationCheckbox').checked;
					$('#inputEmailValidation').val('');
					$('#inputEmailValidationForm').addClass("hidden");
					Session.set("profileSettingsSave", true);
					Session.set("profileSettingsCancel", true);
					Meteor.call("updateUsersEmail", email);
					Meteor.call("updateUsersBirthName", birthname, user_id);
					Meteor.call("updateUsersGivenName", givenname, user_id);
					Meteor.call("updateUsersProfileState", true, user_id);
					Meteor.call("updateUsersName", result, user_id);
					Meteor.call("updateUsersNotification", mailNotification, webNotification, user_id);
					Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-top-left');
				} else {
					Bert.alert(TAPi18n.__('profile.error'), 'warning', 'growl-top-left');
				}
			}
		});
	},
	"change #mailNotificationCheckbox, change #webNotificationCheckbox": function () {
		Session.set("profileSettingsSave", false);
		Session.set("profileSettingsCancel", false);
		$('#errorNotification').html('');
	},
	"click #profileCancel": function () {
		var user = Meteor.users.findOne(Meteor.userId());
		$('#inputEmail').val(user.email);
		$('#inputName').val(user.profile.name);
		$('#inputBirthName').val(user.profile.birthname);
		$('#inputGivenName').val(user.profile.givenname);
		$('#mailNotificationCheckbox').prop('checked', user.mailNotification);
		$('#webNotificationCheckbox').prop('checked', user.webNotification);
		$('#inputName').parent().parent().removeClass('has-error');
		$('#inputBirthName').parent().parent().removeClass('has-error');
		$('#inputGivenName').parent().parent().removeClass('has-error');
		$('#inputEmail').parent().parent().removeClass('has-error');
		$('#inputName').parent().parent().removeClass('has-success');
		$('#inputBirthName').parent().parent().removeClass('has-success');
		$('#inputGivenName').parent().parent().removeClass('has-success');
		$('#inputEmail').parent().parent().removeClass('has-success');
		$('#errorName').html('');
		$('#errorBirthName').html('');
		$('#errorGivenName').html('');
		$('#errorEmail').html('');
		$('#inputEmailValidation').val('');
		$('#inputEmailValidationForm').addClass("hidden");
		Session.set("profileSettingsSave", true);
		Session.set("profileSettingsCancel", true);
		Bert.alert(TAPi18n.__('profile.canceled'), 'danger', 'growl-top-left');
	}
});

/*
 * ############################################################################
 * profileMembership
 * ############################################################################
 */

Template.profileMembership.rendered = function () {
	var customerId = Meteor.user().customerId;

	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#subscribe-form').length) {
				braintree.setup(clientToken, "dropin", {
					container: "subscribe-form",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#upgrade').prop("disabled", true);

						Bert.alert(TAPi18n.__('membership.upgrade.progress'), 'info', 'growl-top-left');
						var nonce = response.nonce;
						var plan = Session.get('plan');
						Meteor.call('btSubscribe', nonce, plan, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								Bert.alert(TAPi18n.__('membership.upgrade.subscribed'), 'success', 'growl-top-left');
							}
						});
					}
				});
			}
		}
	});
};

Template.profileMembership.events({
	"click #upgrade": function () {
		Session.set('plan', 'pro');
	},
	"click #downgrade": function () {
		var hasPro = Cardsets.find({owner: Meteor.userId(), kind: 'pro'}).count();
		if (hasPro > 0) {
			Bert.alert(TAPi18n.__('membership.downgrade.error'), 'danger', 'growl-top-left');
		} else {
			var confirmCancel = confirm(TAPi18n.__('membership.downgrade.confirm'));
			if (confirmCancel) {
				$('#downgrade').prop("disabled", true);
				Session.set('plan', 'standard');

				Meteor.call('btCancelSubscription', function (error, response) {
					if (error) {
						Bert.alert(error.reason, "danger", 'growl-top-left');
					} else {
						if (response.error) {
							Bert.alert(response.error.message, "danger", 'growl-top-left');
						} else {
							Session.set('currentUserPlan_' + Meteor.userId(), null);
							Bert.alert(TAPi18n.__('membership.downgrade.canceled'), 'success', 'growl-top-left');
						}
					}
				});
			}
		}
	},
	"click #sendLecturerRequest": function () {
		var text = Meteor.user().profile.name + " möchte Dozent werden.";
		var type = "Dozenten-Anfrage";
		var target = "admin";

		Meteor.call("addNotification", target, type, text, Meteor.userId(), target);
		Meteor.call("setLecturerRequest", Meteor.userId(), true);
		Bert.alert('Anfrage wurde gesendet', 'success', 'growl-top-left');
	}
});

Template.profileMembership.helpers({
	hasUserData: function () {
		var email = Meteor.user().email;
		return email !== "" && email !== undefined;
	}
});


/*
 * ############################################################################
 * profileBilling
 * ############################################################################
 */

Template.profileBilling.onCreated(function () {
	Session.set("switchedSitesCheck", undefined);
});

Template.profileBilling.onRendered(function () {
	var customerId = Meteor.user().customerId;

	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#paymentMethodDropIn').length) {
				braintree.setup(clientToken, "dropin", {
					container: "paymentMethodDropIn",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#savePaymentBtn').prop("disabled", true);

						Bert.alert(TAPi18n.__('billing.payment.progress'), 'info', 'growl-top-left');
						var nonce = response.nonce;
						Meteor.call('btUpdatePaymentMethod', nonce, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								Bert.alert(TAPi18n.__('billing.payment.saveMsg'), 'success', 'growl-top-left');
								$('#savePaymentBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		}
	});


	Meteor.call('getClientToken', customerId, function (error, clientToken) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
		} else {
			if ($('#payoutDropIn').length) {
				braintree.setup(clientToken, "dropin", {
					container: "payoutDropIn",
					onPaymentMethodReceived: function (response) {
						$('#payoutBtn').prop("disabled", true);
						Bert.alert(TAPi18n.__('billing.balance.progress'), 'info', 'growl-top-left');

						var nonce = response.nonce;

						Meteor.call('btCreateCredit', nonce, function (error, success) {
							if (error) {
								throw new Meteor.Error('transaction-creation-failed');
							} else if (success !== undefined && success.name === "authorizationError") {
								Bert.alert(TAPi18n.__('billing.balance.failed'), 'danger', 'growl-top-left');
							} else {
								Meteor.call("resetUsersBalance", Meteor.userId());
								Bert.alert(TAPi18n.__('billing.balance.success'), 'success', 'growl-top-left');
								$('#payoutBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		}
	});
});

Template.profileBilling.helpers({
	getInvoices: function () {
		return Paid.find({user_id: Meteor.userId()}, {sort: {date: -1}});
	},
	getRevenue: function () {
		var cardsetsIds = Cardsets.find({
			owner: Meteor.userId()
		}).map(function (cardset) {
			return cardset._id;
		});

		return Paid.find({cardset_id: {$in: cardsetsIds}}, {sort: {date: -1}});
	},
	getCardsetName: function (cardset_id) {
		return (cardset_id !== undefined) ? Cardsets.findOne(cardset_id).name : undefined;
	},
	getBalance: function () {
		Meteor.subscribe("privateUserData");
		var balance = Meteor.users.findOne(Meteor.userId).balance;
		return (balance !== undefined) ? parseFloat(balance).toFixed(2) : 0;
	},
	hasBalance: function () {
		Meteor.subscribe("privateUserData");
		var balance = Meteor.users.findOne(Meteor.userId).balance;
		return balance > 0;
	},
	getPaymentMethod: function () {
		Meteor.call("btGetPaymentMethod", function (error, result) {
			if (result) {
				Session.set("paymentMethods", result);
			}
		});
		return Session.get('paymentMethods');
	},
	hasPaymentMethod: function () {
		Meteor.call("btGetPaymentMethod", function (error, result) {
			if (result) {
				Session.set("hasPaymentMethods", !jQuery.isEmptyObject(result));
			}
		});
		return Session.get('hasPaymentMethods');
	}
});

/*
 * ############################################################################
 * profileNotifications
 * ############################################################################
 */

Template.profileNotifications.events({
	"click #clearBtn": function () {
		var notifications = Notifications.find({target_type: 'user', target: Meteor.userId()});
		notifications.forEach(function (notification) {
			Meteor.call("deleteNotification", notification);
		});
	},
	"click #deleteNotificationBtn": function () {
		Meteor.call("deleteNotification", this._id);
	}
});

Template.profileNotifications.helpers({
	getNotifications: function () {
		return Notifications.find({target_type: 'user', target: Meteor.userId()}, {sort: {date: -1}});
	},
	getLink: function () {
		return "/cardset/" + this.link_id;
	},
	getStatus: function () {
		if (this.type === 'Kartensatz-Freigabe') {
			var cardset = Cardsets.findOne(this.link_id);
			return (cardset.visible === true) ? TAPi18n.__('notifications.approved') : TAPi18n.__('notifications.pending');
		} else {
			return TAPi18n.__('notifications.progress');
		}
	}
});

/*
 * ############################################################################
 * profileRequests
 * ############################################################################
 */

Template.profileRequests.helpers({
	getRequests: function () {
		return Cardsets.find({request: true});
	}
});

/*
 * ############################################################################
 * profileDeleteConfirmForm
 * ############################################################################
 */

Template.profileDeleteConfirmForm.events({
	'click #profileDelete': function () {
		$('#profileDelteConfirmModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteUserProfile");
			document.location.reload(true);
		}).modal('hide');
	}
});
