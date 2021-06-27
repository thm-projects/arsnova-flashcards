import {ServerStyle} from "./styles";
import XRegExp from 'xregexp';
import {LoginTasks} from "./login";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "./mainNavigation";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";


// Move the predefined fields at the end
let mail = AccountsTemplates.removeField('email');
let pwd = AccountsTemplates.removeField('password');

export let AccountUtils = class AccountUtils {
	static exists (username) {
		return Meteor.users.findOne({username: username}) !== undefined;
	}

	static mailExists (mailAddress) {
		let result = Meteor.users.find({"services.password": {$exists: true}}).fetch();
		for (let i = 0; i < result.length; i++) {
			if (result[i].emails[0].address === mailAddress) {
				return true;
			}
		}
		return false;
	}

	static getWhitelistedDomains () {
		return ServerStyle.getConfig().login.cards.domainWhitelist;
	}

	static isDomainWhitelisted (mailAddress) {
		let whitelist = ServerStyle.getConfig().login.cards.domainWhitelist;
		if (whitelist.length) {
			for (let i = 0; i < whitelist.length; i++) {
				let result = XRegExp.exec(mailAddress, new XRegExp('.+@' + whitelist[i]));
				if (result !== undefined && result !== null && result.length) {
					return true;
				}
			}
			return false;
		} else {
			return true;
		}
	}

	static isAllowedToReceiveNotifications (mailAddress) {
		let blacklist = ServerStyle.getNotificationsBlacklist();
		if (blacklist.length) {
			for (let i = 0; i < blacklist.length; i++) {
				let result = XRegExp.exec(mailAddress, new XRegExp('.+@' + blacklist[i]));
				if (result !== undefined && result !== null && result.length) {
					return false;
				}
			}
			return true;
		} else {
			return true;
		}
	}
};

function submitHooks(error, state) {
	if (state === "signIn") {
		if (!error && Meteor.user()) {
			if (!Roles.userIsInRole(Meteor.userId(), ['blocked']) && MainNavigation.getLoginTarget() !== undefined && MainNavigation.getLoginTarget() !== false && MainNavigation.getLoginTarget() !== "/") {
				FlowRouter.go(MainNavigation.getLoginTarget());
				MainNavigation.setLoginTarget(false);
			} else {
				LoginTasks.setLoginRedirect();
			}
		}
	}
	AccountsTemplates.setState('signIn');
}

export let accountSubmitHook = function (error, state) {
	if (!error) {
		submitHooks(error, state);
	} else if (error.error !== 400 && Meteor.settings.public.backdoorEnabled === true) {
		submitHooks(error, state);
	} else {
		console.log(error);
	}
};

mail.func = function (value) {
	if (Meteor.isClient) {
		let self = this;
		if (AccountsTemplates.getState() == 'signUp') {
			if (AccountUtils.isDomainWhitelisted(value)) {
				Meteor.call("mailExists", value, function (err, mailExists) {
					if (!mailExists) {
						self.setSuccess();
					} else {
						self.setError(TAPi18n.__('loginModal.errors.mailAlreadyExists'));
					}
					self.setValidating(false);
				});
			} else {
				self.setError(TAPi18n.__('loginModal.errors.domains'));
				self.setValidating(false);
			}
		} else {
			self.setSuccess();
			self.setValidating(false);
		}
		return;
	} else {
		// Server
		return AccountUtils.mailExists(value) || !AccountUtils.isDomainWhitelisted(value);
	}
};

pwd.minLength = 8;

AccountsTemplates.addFields([
	{
		_id: 'username',
		type: 'text',
		displayName: 'Benutzerkennung',
		placeholder: 'Benutzerkennung',
		required: true,
		minLength: 3,
		errStr: TAPi18n.__('loginModal.errors.nameLength', {length: 3}),
		func: function (value) {
			if (Meteor.isClient) {
				let self = this;
				Meteor.call("accountExists", value, function (err, userExists) {
					if (!userExists) {
						self.setSuccess();
					} else {
						self.setError(TAPi18n.__('loginModal.errors.nameAlreadyExists'));
					}
					self.setValidating(false);
				});
				return;
			} else {
				// Server
				return AccountUtils.exists(value);
			}
		}
	},
	{
		_id: 'birthname',
		type: 'text',
		displayName: 'Nachname',
		placeholder: 'Nachname',
		required: true,
		minLength: 3
	},
	{
		_id: 'givenname',
		type: 'text',
		displayName: 'Vorname',
		placeholder: 'Vorname',
		required: true,
		minLength: 3
	},
	mail,
	pwd
]);
