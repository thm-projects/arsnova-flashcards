import * as global from "./global.js";

function agreeCookies() {
	browser.waitForExist('body > div.cc-window.cc-floating.cc-type-info.cc-theme-classic.cc-top.cc-left.cc-color-override-722956343 > div > a', global.threshold);
	browser.setCookie({name: 'cookieconsent_dismissed', value: 'yes'});
	browser.click('body > div.cc-window.cc-floating.cc-type-info.cc-theme-classic.cc-top.cc-left.cc-color-override-722956343 > div > a');
}

function setResolution() {
	browser.setViewportSize({
		width: 1280,
		height: 768
	});
	browser.windowHandleSize();
}

module.exports = {
	login: function (userLogin) {
		if (browser.getUrl() === "about:blank") {
			browser.url(global.baseURL);
			setResolution();
			agreeCookies();
			browser.waitForVisible('#TestingBackdoorUsername', global.threshold);
			browser.click('#TestingBackdoorUsername', global.threshold);
			browser.waitForVisible('#' + userLogin);
			browser.click('#' + userLogin);
			browser.waitForVisible('#BackdoorLogin', global.threshold);
			browser.click('#BackdoorLogin');
		}
	},
	logout: function () {
		browser.waitForExist('#logout', global.threshold);
		browser.click('#logout');
	},
	selectMyCardset: function () {
		browser.waitForVisible('#cardsets', global.threshold);
		browser.click('#cardsets');
		this.checkUrl(global.createRoute);
	},
	selectLearnset: function () {
		browser.waitForVisible('#learnsets', global.threshold);
		browser.click('#learnsets');
		this.checkUrl(global.learnRoute);
	},
	selectPool: function () {
		browser.waitForVisible('#pool', global.threshold);
		browser.click('#pool');
		this.checkUrl(global.poolRoute);
	},
	selectCardsetLink: function (number) {
		number = number - 1;
		browser.waitForVisible('#cardsetLink' + number, global.threshold);
		browser.click('#cardsetLink' + number);
		browser.waitForExist(".carousel-inner", global.threshold);
		return browser.elements(".carousel-inner > div").value.length;
	},
	checkUrl: function (url) {
		browser.waitUntil(function () {
			return (global.baseURL + url) === browser.getUrl();
		}, global.threshold, 'expected URL to be ' + browser.getUrl() + ' but got ' + (global.baseURL + url) + global.thresholdText);
	},
	compareUrl: function (url1, url2) {
		browser.waitUntil(function () {
			return url1 === url2;
		}, global.threshold, 'expected URL to be ' + url1 + ' but got ' + url2 + global.thresholdText);
	},
	firstLogin: function (username) {
		this.login(username);
		browser.waitForExist('#accept_checkbox', global.threshold);
		browser.$('#accept_checkbox').click();
		browser.click('button[id="accept_button"]');
	},
	logoutAdmin: function () {
		browser.waitForExist('#logout_admin', global.threshold);
		browser.click('#logout_admin');
	},
	back: function (click = true) {
		browser.waitForVisible('#backButton', global.threshold);
		if (click) {
			browser.click('#backButton');
		}
	},
	switchToBackEnd: function (click = true) {
		browser.waitForVisible("#adminpanel", global.threshold);
		if (click) {
			browser.click('#adminpanel');
		}
	},
	backendCardset: function (click = true) {
		browser.waitForVisible("a[href='/admin/cardsets']", global.threshold);
		if (click) {
			browser.click("a[href='/admin/cardsets']");
		}
	},
	backendCollege: function (click = true) {
		browser.waitForVisible("a[href='/admin/university']", global.threshold);
		if (click) {
			browser.click("a[href='/admin/university']");
		}
	},
	newCardset: function (click = true) {
		browser.waitForVisible('#newCardSet', global.threshold);
		if (click) {
			browser.click('#newCardSet');
		}
	},
	compareContent: function (content1, content2, dataType, attribute = 0, isTrue = true) {
		let errorMessage;
		let receivedContent;
		if (dataType < 4) {
			browser.waitForVisible(content1, global.threshold);
			errorMessage = 'Expected content of ' + content1 + ' to be ' + content2 + ' but got ';
		} else {
			errorMessage = 'Expected content ' + content1 + ' to be ' + content2;
		}
		browser.waitUntil(function () {
			switch (dataType) {
				case 0:
					receivedContent = browser.getText(content1);
					return (receivedContent === content2) === isTrue;
				case 1:
					receivedContent = browser.elements(content1).value.length;
					return (receivedContent === content2) === isTrue;
				case 2:
					receivedContent = browser.getAttribute(content1, attribute);
					return (receivedContent === content2) === isTrue;
				case 3:
					receivedContent = browser.getAttribute(content1, attribute);
					return (parseInt(receivedContent) === parseInt(content2)) === isTrue;
				case 4:
					return (content1 === content2) === isTrue;
				case 5:
					return (parseInt(content1) === parseInt(content2)) === isTrue;
				case 6:
					receivedContent = browser.getText(content1);
					return (parseInt(receivedContent) === parseInt(content2)) === isTrue;
			}
		}, global.threshold, errorMessage + receivedContent + global.thresholdText);
	},
	getContent: function (content, dataType, attribute = 0) {
		browser.waitForVisible(content, global.threshold);
		switch (dataType) {
			case 0:
				return browser.getText(content);
			case 1:
				return browser.elements(content).value.length;
			case 2:
				return browser.getAttribute(content, attribute);
		}
	},
	contentVisible: function (element, isVisible = true) {
		let notVisible = '';
		if (!isVisible) {
			notVisible = 'not ';
		}
		browser.waitUntil(function () {
			return browser.isVisible(element) === isVisible;
		}, global.threshold, 'expected ' + element + ' to be ' + notVisible + 'visible' + global.thresholdText);
	},
	setContent: function (content, text) {
		browser.waitForVisible(content, global.threshold);
		browser.setValue(content, text);
	},
	clickElement: function (element) {
		browser.waitForVisible(element, global.threshold);
		browser.click(element);
	},
	resetPool: function () {
		this.selectPool();
		browser.waitForVisible('#resetBtn', global.threshold);
		browser.click('#resetBtn');
	}
};
