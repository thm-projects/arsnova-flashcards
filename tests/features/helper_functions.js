export const TIMERTHRESHOLD = 15000;
export const TIMERTHRESHOLDTEXT = '15 seconds.';

function agreeCookies() {
	browser.waitForExist('a.cc_btn.cc_btn_accept_all', TIMERTHRESHOLD);
	browser.setCookie({name: 'cookieconsent_dismissed', value: 'yes'});
	browser.click('a.cc_btn.cc_btn_accept_all');
}

function setResolution() {
	browser.setViewportSize({
		width: 1920,
		height: 1080
	});
	browser.windowHandleSize();
}

/* exported login */
export function login(userLogin) {
	setResolution();
	agreeCookies();
	browser.waitForVisible('#TestingBackdoorUsername', TIMERTHRESHOLD);
	browser.click('#TestingBackdoorUsername', TIMERTHRESHOLD);
	browser.waitForVisible('#' + userLogin);
	browser.click('#' + userLogin);
	browser.waitForVisible('#BackdoorLogin', TIMERTHRESHOLD);
	browser.click('#BackdoorLogin');
}

/* exported logout */
export function logout() {
	browser.waitForExist('#logout', TIMERTHRESHOLD);
	browser.click('#logout');
}

/* exported firstLogin */
export function firstLogin(username) {
	login(username);
	browser.waitForExist('#accept_checkbox', TIMERTHRESHOLD);
	browser.$('#accept_checkbox').click();
	browser.click('button[id="accept_button"]');
}

/* exported logoutAdmin */
export function logoutAdmin() {
	browser.waitForExist('#logout_admin', TIMERTHRESHOLD);
	browser.click('#logout_admin');
}
