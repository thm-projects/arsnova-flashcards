const SERVER_USERS = ['NotificationsTestUser', '.cards'];

const VISIBLE_FIELDS = {
	frontend: {
		'profile.birthname': 1,
		'profile.givenname': 1,
		'profile.title': 1
	},
	backend: {
		createdAt: 1,
		'services.cas.id': 1,
		'services.password.id': 1,
		profile: 1,
		name: 1,
		username: 1,
		email: 1,
		birthname: 1,
		givenname: 1,
		title: 1,
		visible: 1,
		status: 1,
		mailNotification: 1,
		webNotification: 1,
		lastOnAt: 1,
		roles: 1
	}
};

module.exports = {
	SERVER_USERS,
	VISIBLE_FIELDS
};
