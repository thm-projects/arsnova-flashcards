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
		Meteor.call("mailExists", value, function (err, mailExists) {
			if (!mailExists) {
				self.setSuccess();
			} else {
				self.setError(mailExists);
			}
			self.setValidating(false);
		});
		return;
	} else {
		// Server
		return AccountUtils.mailExists(value);
	}
};

pwd.minLength = 8;

AccountsTemplates.addFields([
	{
		_id: 'username',
		type: 'text',
		displayName: 'user',
		placeholder: 'user',
		required: true,
		func: function (value) {
			if (Meteor.isClient) {
				let self = this;
				Meteor.call("accountExists", value, function (err, userExists) {
					if (!userExists) {
						self.setSuccess();
					} else {
						self.setError(userExists);
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
		displayName: 'Last Name',
		placeholder: 'Last Name',
		required: false
	},
	{
		_id: 'givenname',
		type: 'text',
		displayName: 'First Name',
		placeholder: 'First Name',
		required: false
	},
	mail,
	pwd
]);
