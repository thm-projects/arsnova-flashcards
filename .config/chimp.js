module.exports = {
	seleniumStandaloneOptions: {
		version: '3.11.0',
		drivers: {
			chrome: {
				version: '2.36'
			},
			ie: {
				version: '3.6.0'
			},
			firefox: {
				version: '0.20.0'
			}
		}
	},
	//
	// SauceLabs:
	// ==========
	/*/

	user: "SAUCE_USER_NAME",
	key: "SAUCE_USER_KEY",

	browser: 'firefox',
	platform: 'Linux'

	// When using Sauce Connect Proxy
	port: 4445,
	host: "localhost",

	// Without proxy:
	//port: 80,
	//host: "ondemand.saucelabs.com"
	//*/
};
