/* exported login */
export function login(username) {
	browser.waitForVisible('#TestingBackdorUsername',5000);
	var SetUsername = function (name) {
		$('#TestingBackdorUsername').val(name);
	};
	client.execute(SetUsername, username);
	browser.waitForVisible('a[id="BackdoorLogin"]',5000);
	browser.click('a[id="BackdoorLogin"]');
}

/* exported logout */
export function logout() {
	browser.waitForExist('#logout', 5000);
	browser.click('#logout');
}

/* exported agreeCookies */
export function agreeCookies() {
	browser.setCookie({name: 'cookieconsent_dismissed', value: 'yes'});
}

/* exported firstLogin */
export function firstLogin(username) {
	login(username);
	browser.waitForExist('#accept_checkbox', 5000);
	browser.$('#accept_checkbox').click();
	browser.click('button[id="accept_button"]');
}

/* exported setResolution */
export function setResolution() {
	browser.setViewportSize({
		width: 1920,
		height: 1080
	});
	browser.windowHandleSize();
}

/* exported logoutAdmin */
export function logoutAdmin() {
	browser.waitForExist('#logout_admin', 5000);
	browser.click('#logout_admin');
}
