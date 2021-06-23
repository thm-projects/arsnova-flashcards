const DELETED_USER_ID = 'DeletedUser';
const CARDS_USER_ID = '.cards';
const NOTIFICATIONS_USER_ID = 'NotificationsTestUser';

const SERVER_USERS = [NOTIFICATIONS_USER_ID, CARDS_USER_ID];

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
	VISIBLE_FIELDS,
	DELETED_USER_ID,
	NOTIFICATIONS_USER_ID,
	CARDS_USER_ID
};
