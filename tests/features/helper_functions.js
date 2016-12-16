/* exported login */
export function login(username) {
	var SetUsername = function (name) {
		$('#TestingBackdorUsername').val(name);
	};
	browser.waitForExist("#TestingBackdorUsername", 5000);
	client.execute(SetUsername, username);
	browser.click('a[id="BackdoorLogin"]');
	browser.click('a[id="BackdoorLogin"]');
}

/* exported logout */
export function logout() {
	browser.waitForExist('#logout', 5000);
	browser.click('#logout');
}

export function agreeCookies() {
	browser.setCookie({name: 'cookieconsent_dismissed', value: 'yes'});
}

/* exported firstLogin */
export function firstLogin() {
	login();
	browser.waitForExist('#accept_checkbox', 5000);
	browser.$('#accept_checkbox').click();
	browser.click('button[id="accept_button"]');
}

export function setResolution() {
	browser.setViewportSize({
		width: 1920,
		height: 1080
	});
	browser.windowHandleSize();
}
