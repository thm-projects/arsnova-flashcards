import {ServerStyle} from "./styles";
import XRegExp from 'xregexp';

export let AccountUtils = class AccountUtils {
	static exists (username) {
		return Meteor.users.findOne({username: username}) !== undefined;
	}

	static mailExists (mail) {
		let result = Meteor.users.find({"services.password": {$exists: true}}).fetch();
		for (let i = 0; i < result.length; i++) {
			if (result[i].emails[0].address === mail) {
				return true;
			}
		}
		return false;
	}

	static getWhitelistedDomains () {
		return ServerStyle.getConfig().login.cards.domainWhitelist;
	}

	static isDomainWhitelisted (mail) {
		let whitelist = ServerStyle.getConfig().login.cards.domainWhitelist;
		if (whitelist.length) {
			for (let i = 0; i < whitelist.length; i++) {
				let result = XRegExp.exec(mail, new XRegExp('.+@' + whitelist[i]));
				if (result !== undefined && result !== null && result.length) {
					return true;
				}
			}
			return false;
		} else {
			return true;
		}
	}
};


// Move the predefined fields at the end
let mail = AccountsTemplates.removeField('email');
let pwd = AccountsTemplates.removeField('password');

function submitHooks(error, state) {
	if (state === "signIn") {
		if (!error && Meteor.isClient) {
			location.reload();
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
		displayName: 'Vorname',
		placeholder: 'Vorname',
		required: true
	},
	{
		_id: 'givenname',
		type: 'text',
		displayName: 'Nachname',
		placeholder: 'Nachname',
		required: true
	},
	mail,
	pwd
]);
