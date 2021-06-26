//List of whitelisted e-mail domains for the registration process
export const DEFAULT_REGISTRATION_DOMAIN_WHITELIST =
	[
		'.*\.fra-uas\.de',
		'h-da\.de',
		'.*\.h-da\.de',
		'.*\.hs-fulda\.de',
		'hs-gm\.de',
		'hs-rm\.de',
		'\.hs-rm\.de',
		'kgu\.de',
		'.*\.thm\.de',
		'.*\.tu-darmstadt\.de',
		'uni-frankfurt\.de',
		'.*\.uni-frankfurt\.de',
		'.*\..*\.uni-frankfurt\.de',
		'.*\.uni-giessen\.de',
		'.*\..*\.uni-giessen\.de',
		'uni-kassel\.de',
		'.*\.uni-kassel\.de',
		'.*\.uni-marburg\.de'
	];

//Mostly used to prevent the staging server from sending notifications to test database users
export const DEFAULT_NOTIFICATIONS_BLACKLIST = [
	'example\.com'
];
