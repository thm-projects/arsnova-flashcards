//------------------------ IMPORTS


import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Experience} from "../../api/experience.js";
import {Badges} from "../../api/badges.js";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
import {Ratings} from "../../api/ratings.js";
import {Paid} from "../../api/paid.js";
import {Notifications} from "../../api/notifications.js";
import {AdminSettings} from "../../api/adminSettings";
import "./profile.html";


Meteor.subscribe("experience");
Meteor.subscribe("badges");
Meteor.subscribe("notifications");
Meteor.subscribe("userData");
Meteor.subscribe("cardsets");
Meteor.subscribe('default_db_data', function () {
	//Set the reactive session as true to indicate that the data have been loaded
	Session.set('data_loaded', true);
});

function getLvl() {
	var user = Meteor.users.findOne(Router.current().params._id);
	if (user === undefined) {
		return null;
	}
	return user.lvl;
}

function xpForLevel(level) {
	var points = 0;

	for (var i = 1; i < level; i++) {
		points += Math.floor(i + 30 * Math.pow(2, i / 10));
	}
	return Math.floor(points / 4);
}

function kritiker(rank) {
	var ratings = Ratings.find({
		user: Meteor.userId()
	}).count();

	var badge = Badges.findOne("1");
	switch (rank) {
		case 3:
			return ratings / badge.rank3 * 100;
		case 2:
			return ratings / badge.rank2 * 100;
		case 1:
			return ratings / badge.rank1 * 100;
		default:
			return 0;
	}
}

function krone(rank) {
	var cardsets = Cardsets.find({
		owner: Meteor.userId()
	});

	var count = 0;

	cardsets.forEach(function (cardset) {
		var ratings = Ratings.find({
			cardset_id: cardset._id
		});
		if (ratings.count() > 1) {
			var total = 0;
			ratings.forEach(function (rating) {
				total += rating.rating;
			});
			if (total / ratings.count() >= 4.5) {
				count++;
			}
		}
	});

	var badge = Badges.findOne("2");
	switch (rank) {
		case 3:
			return count / badge.rank3 * 100;
		case 2:
			return count / badge.rank2 * 100;
		case 1:
			return count / badge.rank1 * 100;
		default:
			return 0;
	}
}

function stammgast(rank) {
	var user = Meteor.users.findOne(Meteor.userId()).daysInRow;

	var badge = Badges.findOne("3");
	switch (rank) {
		case 3:
			return user / badge.rank3 * 100;
		case 2:
			return user / badge.rank2 * 100;
		case 1:
			return user / badge.rank1 * 100;
		default:
			return 0;
	}
}

function streber(rank) {
	var learned = Learned.find({
		user_id: Meteor.userId()
	}).count();

	var badge = Badges.findOne("4");
	switch (rank) {
		case 3:
			return learned / badge.rank3 * 100;
		case 2:
			return learned / badge.rank2 * 100;
		case 1:
			return learned / badge.rank1 * 100;
		default:
			return 0;
	}
}

function wohltaeter(rank) {
	var cardsets = Cardsets.find({
		owner: Meteor.userId(),
		visible: true
	});

	var count = 0;

	cardsets.forEach(function (cardset) {
		var cards = Cards.find({
			cardset_id: cardset._id
		});
		if (cards.count() >= 5) {
			count++;
		}
	});

	var badge = Badges.findOne("5");
	switch (rank) {
		case 3:
			return count / badge.rank3 * 100;
		case 2:
			return count / badge.rank2 * 100;
		case 1:
			return count / badge.rank1 * 100;
		default:
			return 0;
	}
}

function bestseller(rank) {
	var cardsetsIds = Cardsets.find({
		owner: Meteor.userId()
	}).map(function (cardset) {
		return cardset._id;
	});

	var learner = Learned.find({
		cardset_id: {$in: cardsetsIds}
	}).count();

	var badge = Badges.findOne("6");
	switch (rank) {
		case 3:
			return learner / badge.rank3 * 100;
		case 2:
			return learner / badge.rank2 * 100;
		case 1:
			return learner / badge.rank1 * 100;
		default:
			return 0;
	}
}

Template.registerHelper("getUser", function () {
	var user = Meteor.users.findOne(Router.current().params._id);
	Session.set("user", user);
	return user;
});
Template.registerHelper("isUser", function () {
	return Router.current().params._id === Meteor.userId();
});

/**
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

/**
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

/**
 * ############################################################################
 * profileSettings
 * ############################################################################
 */

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
		$('#profileCancel')[0].disabled = false;

		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			$('#profileSave')[0].disabled = false;
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			$('#profileSave')[0].disabled = false;
		} else {//E-Mail was changed and is wrong
			$('#profileSave')[0].disabled = true;
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
		$('#profileCancel')[0].disabled = false;
		if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {
			$('#profileSave')[0].disabled = false;
			$('#inputEmailValidation').parent().parent().removeClass('has-error');
			$('#inputEmailValidation').parent().parent().addClass('has-success');
			$('#errorEmailValidation').html('');
		} else {
			$('#profileSave')[0].disabled = true;
			$('#inputEmailValidation').parent().parent().removeClass('has-success');
			$('#inputEmailValidation').parent().parent().addClass('has-error');
			$('#errorEmailValidation').html(TAPi18n.__('panel-body.emailValidationError'));
		}
	},
	"keyup #inputName": function () {
		$('#profileCancel')[0].disabled = false;
		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			$('#profileSave')[0].disabled = false;
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			$('#profileSave')[0].disabled = false;
		} else {//E-Mail was changed and is wrong
			$('#profileSave')[0].disabled = true;
		}
	},
	"keyup #inputBirthName": function () {
		$('#profileCancel')[0].disabled = false;
		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			$('#profileSave')[0].disabled = false;
			$('#profileCancel')[0].disabled = false;
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			$('#profileSave')[0].disabled = false;
			$('#profileCancel')[0].disabled = false;
		} else {//E-Mail was changed and is wrong
			$('#profileSave')[0].disabled = true;
			$('#profileCancel')[0].disabled = true;
		}
	},
	"keyup #inputGivenName": function () {
		$('#profileCancel')[0].disabled = false;
		//E-Mail wasn't changed
		if ($('#inputEmailValidation').val() === '' && $('#inputEmail').val() === Meteor.users.findOne(Meteor.userId()).email) {
			$('#inputEmailValidationForm').addClass("hidden");
			$('#profileSave')[0].disabled = false;
			$('#profileCancel')[0].disabled = false;
		} else if ($('#inputEmail').val() === $('#inputEmailValidation').val()) {//E-Mail was changed and is right
			$('#profileSave')[0].disabled = false;
			$('#profileCancel')[0].disabled = false;
		} else {//E-Mail was changed and is wrong
			$('#profileSave')[0].disabled = true;
			$('#profileCancel')[0].disabled = true;
		}
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
					$('#inputEmailValidation').val('');
					$('#inputEmailValidationForm').addClass("hidden");
					$('#profileSave')[0].disabled = true;
					$('#profileCancel')[0].disabled = true;
					Meteor.call("updateUsersEmail", email);
					Meteor.call("updateUsersBirthName", birthname, user_id);
					Meteor.call("updateUsersGivenName", givenname, user_id);
					Meteor.call("updateUsersProfileState", true, user_id);
					Meteor.call("updateUsersName", result, user_id);
					Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
				} else {
					Bert.alert(TAPi18n.__('profile.error'), 'warning', 'growl-bottom-right');
				}
			}
		});
	},
	"click #profileCancel": function () {
		var user = Meteor.users.findOne(Meteor.userId());
		$('#inputEmail').val(user.email);
		$('#inputName').val(user.profile.name);
		$('#inputBirthName').val(user.profile.birthname);
		$('#inputGivenName').val(user.profile.givenname);
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
		$('#profileSave')[0].disabled = true;
		$('#profileCancel')[0].disabled = true;
		$('#profileSave')[0].disabled = true;
		$('#profileCancel')[0].disabled = true;
		Bert.alert(TAPi18n.__('profile.canceled'), 'danger', 'growl-bottom-right');
	}
});

/**
 * ############################################################################
 * profileMembership
 * ############################################################################
 */

Template.profileMembership.rendered = function () {
	var customerId = Meteor.user().customerId;

	if ($('#subscribe-form').length) {
		Meteor.call('getClientToken', customerId, function (error, clientToken) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
			} else {
				braintree.setup(clientToken, "dropin", {
					container: "subscribe-form",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#upgrade').prop("disabled", true);

						Bert.alert(TAPi18n.__('membership.upgrade.progress'), 'info', 'growl-bottom-right');
						var nonce = response.nonce;
						var plan = Session.get('plan');
						Meteor.call('btSubscribe', nonce, plan, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								Bert.alert(TAPi18n.__('membership.upgrade.subscribed'), 'success', 'growl-bottom-right');
							}
						});
					}
				});
			}
		});
	}
};

Template.profileMembership.events({
	"click #upgrade": function () {
		Session.set('plan', 'pro');
	},
	"click #downgrade": function () {
		var hasPro = Cardsets.find({owner: Meteor.userId(), kind: 'pro'}).count();
		if (hasPro > 0) {
			Bert.alert(TAPi18n.__('membership.downgrade.error'), 'danger', 'growl-bottom-right');
		} else {
			var confirmCancel = confirm(TAPi18n.__('membership.downgrade.confirm'));
			if (confirmCancel) {
				$('#downgrade').prop("disabled", true);
				Session.set('plan', 'standard');

				Meteor.call('btCancelSubscription', function (error, response) {
					if (error) {
						Bert.alert(error.reason, "danger", 'growl-bottom-right');
					} else {
						if (response.error) {
							Bert.alert(response.error.message, "danger", 'growl-bottom-right');
						} else {
							Session.set('currentUserPlan_' + Meteor.userId(), null);
							Bert.alert(TAPi18n.__('membership.downgrade.canceled'), 'success', 'growl-bottom-right');
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
		Bert.alert('Anfrage wurde gesendet', 'success', 'growl-bottom-right');
	}
});

Template.profileMembership.helpers({
	hasUserData: function () {
		email = Meteor.user().email;
		return email !== "" && email !== undefined;
	}
});


/**
 * ############################################################################
 * profileBilling
 * ############################################################################
 */

Template.profileBilling.onRendered(function () {
	var customerId = Meteor.user().customerId;

	if ($('#paymentMethodDropIn').length) {
		Meteor.call('getClientToken', customerId, function (error, clientToken) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
			} else {
				braintree.setup(clientToken, "dropin", {
					container: "paymentMethodDropIn",
					defaultFirst: true,
					onPaymentMethodReceived: function (response) {
						$('#savePaymentBtn').prop("disabled", true);

						Bert.alert(TAPi18n.__('billing.payment.progress'), 'info', 'growl-bottom-right');
						var nonce = response.nonce;
						Meteor.call('btUpdatePaymentMethod', nonce, function (error) {
							if (error) {
								throw new Meteor.Error(error.message, 'error');
							} else {
								Bert.alert(TAPi18n.__('billing.payment.saveMsg'), 'success', 'growl-bottom-right');
								$('#savePaymentBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		});
	}

	if ($('#payoutDropIn').length) {
		Meteor.call('getClientToken', customerId, function (error, clientToken) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
			} else {
				braintree.setup(clientToken, "dropin", {
					container: "payoutDropIn",
					onPaymentMethodReceived: function (response) {
						$('#payoutBtn').prop("disabled", true);
						Bert.alert(TAPi18n.__('billing.balance.progress'), 'info', 'growl-bottom-right');

						var nonce = response.nonce;

						Meteor.call('btCreateCredit', nonce, function (error, success) {
							if (error) {
								throw new Meteor.Error('transaction-creation-failed');
							} else if (success !== undefined && success.name === "authorizationError") {
								Bert.alert(TAPi18n.__('billing.balance.failed'), 'danger', 'growl-bottom-right');
							} else {
								Meteor.call("resetUsersBalance", Meteor.userId());
								Bert.alert(TAPi18n.__('billing.balance.success'), 'success', 'growl-bottom-right');
								$('#payoutBtn').prop("disabled", false);
							}
						});
					}
				});
			}
		});
	}
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

/**
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

/**
 * ############################################################################
 * profileRequests
 * ############################################################################
 */

Template.profileRequests.helpers({
	getRequests: function () {
		return Cardsets.find({request: true});
	}
});

/**
 * ############################################################################
 * profileXp
 * ############################################################################
 */

export var seqOne = 7; //7 tag
export var seqTwo = 29; //30 tag
export var seqThree = 90; //90 tag
var backgroundColorBox1 = 1;
var backgroundColorBox2 = 0;


export function getDays1() {
	if (Session.get('data_loaded')) {
		var seq = AdminSettings.findOne({name: "seqSettings"});
		seqOne = seq.seqOne;
		return seqOne;
	}
}

export function getDays2() {
	if (Session.get('data_loaded')) {
		var seq = AdminSettings.findOne({name: "seqSettings"});
		seqTwo = seq.seqTwo;
		return seqTwo;
	}
}

export function getDays3() {
	if (Session.get('data_loaded')) {
		var seq = AdminSettings.findOne({name: "seqSettings"});
		seqThree = seq.seqThree;
		return seqThree;
	}
}


Template.profileXp.helpers({
	getDays1: getDays1,
	getDays2: getDays2,
	getDays3: getDays3,
	getXpTotal: function () {
		var allXp = Experience.find({
			owner: Router.current().params._id
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		Session.set("totalXp", result);
		return result;
	},
	getXpToday: function () {
		var date = new Date();
		date.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: date
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},
	getXpYesterday: function () {
		var minDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
		minDate.setHours(0, 0, 0, 0);
		var maxDate = new Date();
		maxDate.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: minDate,
				$lte: maxDate
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},
	getXpTwoDaysAgo: function () {
		var minDate = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
		minDate.setHours(0, 0, 0, 0);
		var maxDate = new Date();
		maxDate.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: minDate,
				$lte: maxDate
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},
	getXpSeq1: function () {
		var minDate = new Date(new Date().getTime() - seqOne * 24 * 60 * 60 * 1000);
		minDate.setHours(0, 0, 0, 0);
		var maxDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		maxDate.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: minDate,
				$lte: maxDate
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},
	getXpSeq2: function () {
		var minDate = new Date(new Date().getTime() - seqTwo * 24 * 60 * 60 * 1000);
		minDate.setHours(0, 0, 0, 0);
		var maxDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		maxDate.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: minDate,
				$lte: maxDate
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},
	getXpSeq3: function () {
		var minDate = new Date(new Date().getTime() - seqThree * 24 * 60 * 60 * 1000);
		minDate.setHours(0, 0, 0, 0);
		var maxDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		maxDate.setHours(0, 0, 0, 0);

		var allXp = Experience.find({
			owner: Router.current().params._id,
			date: {
				$gte: minDate,
				$lte: maxDate
			}
		});
		var result = 0;
		allXp.forEach(function (xp) {
			result = result + xp.value;
		});
		return result;
	},

	getLast: function () {
		var last = Experience.findOne({
			owner: Router.current().params._id
		}, {
			sort: {
				date: -1
			}
		});

		var name = '';
		if (last !== undefined) {
			switch (last.type) {
				case 1:
					name = TAPi18n.__('panel-body-last.login');
					break;
				case 2:
					name = TAPi18n.__('panel-body-last.cardset');
					break;
				case 3:
					name = TAPi18n.__('panel-body-last.card');
					break;
				case 4:
					name = TAPi18n.__('panel-body-last.rating');
					break;
				default:
					name = 'Error';
					break;
			}
		}

		if (last === undefined) {
			return null;
		}
		return name + " (+" + last.value + ")";
	},
	getLvl: function () {
		return getLvl();
	},
	getNextLvl: function () {
		return getLvl() + 1;
	},
	getXp: function () {
		Meteor.call('checkLvl');

		var level = getLvl() + 1;
		var points = xpForLevel(level);
		var required = points - Session.get("totalXp");

		return required;
	},
	getXpPercent: function () {
		var points = Session.get("totalXp");
		var currentLevel = getLvl();
		var nextLevel = getLvl() + 1;
		var currentPoints = xpForLevel(currentLevel);
		var nextPoints = xpForLevel(nextLevel);

		var res = (points - currentPoints) / (nextPoints - currentPoints) * 100;

		return res + "%";
	}
});

function getLvl() {
	var user = Meteor.users.findOne(Router.current().params._id);
	if (user === undefined) {
		return null;
	}
	return user.lvl;
}

function xpForLevel(level) {
	var points = 0;

	for (var i = 1; i < level; i++) {
		points += Math.floor(i + 30 * Math.pow(2, i / 10));
	}
	return Math.floor(points / 4);
}


Template.profileXp.events({
	'onload': setInterval(function () {
		//console.log('Wert von I : ' + i);
		$('#well' + backgroundColorBox1).css("background-color", "lightblue");
		backgroundColorBox1 = backgroundColorBox1 + 1;
		backgroundColorBox2 = backgroundColorBox2 + 1;
		if (backgroundColorBox1 >= 7) {
			backgroundColorBox1 = 1;
		}
		if (backgroundColorBox2 >= 7) {
			backgroundColorBox2 = 0;
		}
		$('#well' + backgroundColorBox2).css("background-color", "lightgreen");
	}, 500)
});


/**
 * ############################################################################
 * profileBadges
 * ############################################################################
 */

Template.profileBadges.helpers({
	getBadges: function () {
		return Badges.find();
	},
	isGained: function (index, rank) {
		switch (index) {
			case 0:
				return kritiker(rank) >= 100;
			case 1:
				return krone(rank) >= 100;
			case 2:
				return stammgast(rank) >= 100;
			case 3:
				return streber(rank) >= 100;
			case 4:
				return wohltaeter(rank) >= 100;
			case 5:
				return bestseller(rank) >= 100;
			default:
				return false;
		}
	},
	getPercent: function (index, rank) {
		switch (index) {
			case 0:
				return kritiker(rank);
			case 1:
				return krone(rank);
			case 2:
				return stammgast(rank);
			case 3:
				return streber(rank);
			case 4:
				return wohltaeter(rank);
			case 5:
				return bestseller(rank);
			default:
				return 0;
		}
	}
});
